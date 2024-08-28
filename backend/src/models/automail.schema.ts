import mongoose, { Schema, Document } from 'mongoose';

export interface AutoMailType extends Document {
    _id: string;
    created: Date;
    createdBy: string;
    updated: Date;
    updatedBy: string;
    frequency: 'Daily' | 'Weekly' | 'Bi-Weekly' | 'Monthly';
    weekday: number;
    day: number;
    time?: string;
    recipient: any;
    contact: string;
    nextRoll: Date;
    lastRollOut: Date
}

const autoMailSchema: Schema<AutoMailType> = new Schema<AutoMailType>({
    created: { type: Date, required: true },
    createdBy: { type: String, required: false },
    updated: { type: Date, required: true },
    updatedBy: { type: String, required: false },
    frequency: { type: String, enum: ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly'], required: false },
    weekday: { type: Number, required: false },
    day: { type: Number, required: false },
    time: { type: String, required: false },
    recipient: { type: Array<String>, required: false },
    contact: { type: String, required: false },
    nextRoll: { type: Date, required: false },
    lastRollOut: { type: Date, required: false },
});

const AutoMail = mongoose.model<AutoMailType>("AutoMails", autoMailSchema);

export default AutoMail;