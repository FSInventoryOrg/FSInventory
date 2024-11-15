import mongoose, { Schema } from "mongoose";
import { SupportTicketPrefix } from "../types/support-ticket";

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
  ISupportTicketCounter, // interface
  supportTicketCounterSchema, // schema
};
