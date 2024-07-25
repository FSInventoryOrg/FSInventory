import mongoose, { Schema, Document } from 'mongoose';

export interface OTPTransactionType extends Document {
  _id: string;
  expirationDate: Date;
  email: string;
  otp: string;
  purpose: string;
  status: string;
}

const OTPTransactionSchema: Schema<OTPTransactionType> = new Schema<OTPTransactionType>({
  expirationDate: { type: Date, required: false },
  email: { type: String, required: false },
  otp: { type: String, required: false },
  purpose: { type: String, required: false },
  status: { type: String, required: false },
});

const OTPTransaction = mongoose.model<OTPTransactionType>("Transaction", OTPTransactionSchema);

export default OTPTransaction;
