import mongoose from "mongoose";
import { ERegions } from "../types";

const questionSchema = new mongoose.Schema({
    questionId: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true,
        enum: ERegions
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

questionSchema.index({ questionId: 1, region: 1 }, { unique: true });

export default mongoose.model('Question', questionSchema);