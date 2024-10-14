import mongoose, {Schema, Document} from 'mongoose';

export interface NotificationSettingsType extends Document {
    _id: string;
    created: Date;
    createdBy: string;
    updated: Date;
    updatedBy: string;
    daysBeforeLicenseExpiration: number;
}

const NotificationSettingsSchema: Schema<NotificationSettingsType> = new Schema<NotificationSettingsType>({
    created: { type: Date, required: true },
    createdBy: { type: String, required: false },
    updated: { type: Date, required: true },
    updatedBy: { type: String, required: false },
    daysBeforeLicenseExpiration: { type: Number, default: 5 }
})

const NotificationSettings = mongoose.model<NotificationSettingsType>("NotificationSettings", NotificationSettingsSchema);

export default NotificationSettings;