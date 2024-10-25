import './cron.js';
import express, { Express } from 'express';
import dotenv from 'dotenv';
import db from './db';
import routes from './routes';

dotenv.config();
const app: Express = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db(); //init db

routes(app);
app.listen(3000, () => {
    console.log(`⚡️ [server]: Server is running at https://localhost:${3000}`);
});


export default app;