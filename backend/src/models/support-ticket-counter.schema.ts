/* eslint-disable no-unused-vars */
import mongoose, { Schema } from "mongoose";

enum SupportTicketPrefix {
  IssueReport = "IR",
  AssetRequest = "AR",
}

interface ISupportTicketCounter {
  prefix: SupportTicketPrefix;
  sequence: number;
}

const supportTicketCounterSchema: Schema<ISupportTicketCounter> =
  new Schema<ISupportTicketCounter>({
    prefix: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(SupportTicketPrefix),
    },
    sequence: {
      type: Number,
      required: true,
    },
  });

const SupportTicketCounterModel = mongoose.model<ISupportTicketCounter>(
  "SupportTicketCounter",
  supportTicketCounterSchema
);

export {
  SupportTicketCounterModel, // model
  SupportTicketPrefix, // enum
  ISupportTicketCounter, // interface
  supportTicketCounterSchema, // schema
};
