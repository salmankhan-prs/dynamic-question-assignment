
import express, { Request, Response } from 'express';
import { IQuestionCreate } from '../types';
import QuestionModel from '../models/question.model';
import mongoose from 'mongoose';
import { getNextQuestionId } from '../helper';


const questionsRouter = express.Router();

questionsRouter.post('/', async (req: Request, res: Response | any) => {
    try {
        const { text, region }: IQuestionCreate = req.body;

        if (!text || !region) {
            return res.status(400).json({ error: 'Text and region are required' });
        }

        // Get or create counter for this region
        const questionId = await getNextQuestionId(region)

        // Create new question
        const question = await QuestionModel.create({
            questionId: questionId,
            text,
            region
        });

        return res.status(201).json(question);
    } catch (error) {
        console.error('Error creating question:', error);
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
});


questionsRouter.get('/:region/:questionId', async (req: Request, res: Response | any) => {
    try {
        const { region, questionId } = req.params;
        console.log(req.params)
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


export default questionsRouter;