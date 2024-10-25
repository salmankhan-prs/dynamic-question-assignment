import { Express } from 'express';
import questionsRouter from './routes/questions';
import cyclicRouter from './routes/cyclic';



export default (app: Express) => {
    app.use('/questions', questionsRouter);
    app.use('/cyclic', cyclicRouter);
};