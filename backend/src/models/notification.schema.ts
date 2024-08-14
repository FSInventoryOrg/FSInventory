import mongoose, { Schema, Document } from 'mongoose';

export interface NotificationType extends Document {
  _id: string;
  updated: Date;
  uniqueLabel: string;
  openTab: boolean;
  url: string;
  message: string;
  message_html: string;
  target_users: any;
  seen_users: any;
  countType?: "Remaining" | "Days";
  table?: string;
  query?: any
}

const notificationSchema: Schema<NotificationType> = new Schema<NotificationType>({
  updated: { type: Date, required: true },
  uniqueLabel: { type: String, required: true, unique: true },
  openTab: { type: Boolean, required: false },
  url: { type: String, required: false },
  message: { type: String, required: true },
  message_html: { type: String, required: false },
  target_users: { type: Array<String>, required: false },
  seen_users: { type: Array<String>, required: false },
  countType: { type: String, enum: ["Remaining", "Days"], required: false },
  table: { type: String, required: false },
  query: { type: Object, required: false },
});

const Notification = mongoose.model<NotificationType>("Notification", notificationSchema);

export default Notification;
