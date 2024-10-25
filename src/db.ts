import mongoose from 'mongoose';

export default async () => {
    const mongoString = 'mongodb://localhost:27017/test';
    try {
        await mongoose.connect(mongoString);
    }
    catch (e) {
        console.log(e);
    }
};