import { getRedisClient } from './caching';
import CounterModel from './models/counter.model';
import { ERegions } from './types';

export const getNextQuestionId = async (region: ERegions) => {

    const redisClient = await getRedisClient();
    const redisKey = `question_seq:${region}`;

    // Try to get the current ID from Redis
    let currentId = await redisClient.get(redisKey);
    if (currentId) return await redisClient.incr(redisKey);

    // If Redis key doesn't exist, try fetching the last ID from MongoDB
    const lastRecord = await CounterModel.findOne({ region });

    // If MongoDB record exists, initialize Redis and increment
    if (lastRecord) {
        await redisClient.set(redisKey, lastRecord.currentQuestionId);
        return await redisClient.incr(redisKey);
    }

    // If no record in MongoDB, initialize with 1 and create MongoDB entry
    const newId = 1;
    await redisClient.set(redisKey, newId);
    await new CounterModel({ region, currentQuestionId: newId }).save();

    return newId;
};
