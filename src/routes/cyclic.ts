
import express, { Request, Response } from 'express';
import QuestionModel from '../models/question.model';
import { getRedisClient } from '../caching';
import cyclicModel from '../models/cyclic.model';


const cyclicRouter = express.Router();


/**
 * Get the current question from the cyclic for the given region
 */
cyclicRouter.get('/:region', async (req: Request, res: Response | any) => {
    try {
        const { region } = req.params;
        const RedisClient = await getRedisClient()

        //get the current question id for the gievn region from redis 
        let questionId = await RedisClient.get(`current_cycle:${region}`);


        if (!questionId) {
            //if the question id is not in redis, get the question id from the database
            questionId = await cyclicModel.findOne({ region });

            if (!questionId) {
                return res.status(404).json({ error: 'Cyclic not found' });
            }
        }

        const question = await QuestionModel.findOne({
            region,
            questionId: parseInt(questionId)
        });

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        return res.json(question);
    } catch (error) {
        console.error('Error fetching question:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


export default cyclicRouter;