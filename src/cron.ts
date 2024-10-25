import { CronJob } from 'cron';
import { getRedisClient } from './caching';
import CyclicModel from './models/cyclic.model';
import QuestionModel from './models/question.model';
import CounterModel from './models/counter.model';
import db from './db';
import questionModel from './models/question.model';


//init db
db()

/**
 * Here we will rotate questions for all regions
 * This should be run every Monday at 7 PM SGT[0 19 * * 1]
 * FIXME: for testing purposes we are running it every minute
 */
new CronJob('* * * * * ', async () => {

    const cylics = await CyclicModel.find();
    const redisClient = await getRedisClient();

    for (const cylic of cylics) {

        const nextQuestionId = cylic.lastAssignedQuestionId + 1;


        if (! await questionModel.findOne({ region: cylic.region, questionId: nextQuestionId })) {
            continue; // skip to update next question if next question doesn't exist. Alternatively, you can reset the counter from the start.
        }
        await CyclicModel.updateOne(
            { region: cylic.region },
            {
                $set: {
                    currentCycleStart: new Date(),
                    lastAssignedQuestionId: nextQuestionId,
                }
            }
        );


        await redisClient.set(`current_cycle:${cylic.region}`, nextQuestionId);
    }

    console.log('Questions rotated for all regions');
}, null, true)



/**
 * Here we will sync counters  from redis to mongodb for all regions perdiodically
 * we can run cron job for every one hour 
   FIXME: for testing purposes we are running it every minute
*/

new CronJob('* * * * * ', async () => {
    try {
        const redisClient = await getRedisClient();

        // Fetch unique regions from MongoDB
        const regions = await QuestionModel.distinct('region');

        for (const region of regions) {

            const redisKey = `question_seq:${region}`;

            const currentId = await redisClient.get(redisKey);

            if (currentId) {
                await CounterModel.updateOne(
                    { region },
                    { $set: { currentQuestionId: Number(currentId) } },
                    { upsert: true }
                );
            }
        }
        console.log('Counters synced to MongoDB');
    } catch (error) {
        console.error('Error syncing counters to MongoDB:', error);
    }

}, null, true)


