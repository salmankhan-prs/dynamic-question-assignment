import mongoose from "mongoose";
import { ERegions } from "../types";


const counterSchema = new mongoose.Schema({
    region: { type: String, enum: ERegions, required: true, unique: true },
    currentQuestionId: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
})



export default mongoose.model('Counter', counterSchema);
