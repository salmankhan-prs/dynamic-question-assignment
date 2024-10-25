import mongoose from "mongoose";
import { ERegions } from "../types";

const cyclicSchema = new mongoose.Schema({
    region: {
        type: String,
        required: true,
        enum: ERegions,
        unique: true //one Cyclic per region is allowed
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastAssignedQuestionId: {
        type: Number,
        required: true
    },
    currentCycleStart: {
        type: Date,
        required: true

    },
    cycleDuration: {
        type: Number,
        required: true
    }
});



export default mongoose.model('Cyclic', cyclicSchema);