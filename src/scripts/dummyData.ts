import { ERegions } from '../types';
import { getNextQuestionId } from '../helper';
import initMongoose from '../db';
import questionModel from '../models/question.model';
import cyclicModel from '../models/cyclic.model';

// this file is load the dummy data in the database

const CYCLE_DURATION = 7;

initMongoose();
async function insertQuestions() {
    try {

        // Insert initial questions for different regions
        const questions = [
            {
                questionId: await getNextQuestionId(ERegions.US),
                text: 'What is your favorite color?',
                region: ERegions.US,
                createdAt: new Date(),
            },
            {
                questionId: await getNextQuestionId(ERegions.SG),
                text: 'What is your favorite hobby?',
                region: ERegions.SG,
                createdAt: new Date(),
            },
            {
                questionId: await getNextQuestionId(ERegions.US),
                text: 'Where did you last travel?',
                region: ERegions.US,
                createdAt: new Date(),
            },
            {
                questionId: await getNextQuestionId(ERegions.IN),
                text: 'What is your dream job?',
                region: ERegions.IN,
                createdAt: new Date(),
            },
            {
                questionId: await getNextQuestionId(ERegions.SG),
                text: 'What is your dream job?',
                region: ERegions.SG,
                createdAt: new Date(),
            },
            {
                questionId: await getNextQuestionId(ERegions.SG),
                text: 'What is your dream job?',
                region: ERegions.SG,
                createdAt: new Date(),
            },
            {
                questionId: await getNextQuestionId(ERegions.US),
                text: 'What is your dream job?',
                region: ERegions.US,
                createdAt: new Date(),
            },


        ];

        await questionModel.insertMany(questions);
        console.log('Questions inserted successfully.');
    } catch (error) {
        console.error('Error inserting questions:', error);
    }
}

async function insertCyclicData() {
    try {
        // Insert initial cyclic data for different regions
        const cyclicData = [
            {
                region: ERegions.SG,
                lastAssignedQuestionId: 1,
                currentCycleStart: new Date(),
                cycleDuration: CYCLE_DURATION,
            },
            {
                region: ERegions.US,
                lastAssignedQuestionId: 1,
                currentCycleStart: new Date(),
                cycleDuration: CYCLE_DURATION,
            },
            {
                region: ERegions.IN,
                lastAssignedQuestionId: 1,
                currentCycleStart: new Date(),
                cycleDuration: CYCLE_DURATION,
            },
        ];

        await cyclicModel.insertMany(cyclicData);

        console.log('Cyclic data inserted successfully.');
    } catch (error) {

        console.error('Error inserting cyclic data:', error);
    }
}




insertQuestions();
insertCyclicData();
