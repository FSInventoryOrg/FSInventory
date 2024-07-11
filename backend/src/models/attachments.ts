import mongoose, { Schema, Document } from 'mongoose';

export interface AttachmentType extends Document {
  _id: string;
  created: Date;
  createdBy: string;
  updated: Date;
  updatedBy: string;
  downloadLink: string;
  infoLink: string;
  size: number;
  filetype: string;
  path: string;
  originalName: string;
}

const attachmentSchema: Schema<AttachmentType> = new Schema<AttachmentType>({
  created: { type: Date, required: true },
  createdBy: { type: String, required: false},
  updated: { type: Date, required: true },
  updatedBy: { type: String, required: false},
  downloadLink: { type: String, required: false },
  infoLink: { type: String, required: false },
  size: { type: Number, required: false },
  filetype: { type: String, required: false },
  path: { type: String, required: false },
  originalName: { type: String, required: false }
});

const Attachment = mongoose.model<AttachmentType>("Attachment", attachmentSchema);

export default Attachment;