import mongoose, { Schema, Document } from "mongoose";
import { AssetType, IssueCategory, TicketType } from "./support-ticket.schema";

export type StatusOptions = {
  value: string;
  color?: string;
  tracked?: boolean;
};

export type CategoryOptions = {
  value: string;
  properties?: string[];
  type?: string;
};

export type Defaults = {
  status?: string;
  category?: string;
  softwareCategory?: string;
  hardwareCategory?: string;
  equipmentType?: string;
  deployableStatus?: string[];
  retrievableStatus?: string;
  inventoryColumns?: string[];
  supportTicketType?: TicketType.IssueReport;
};

export interface OptionsType extends Document {
  _id: string;
  status: StatusOptions[];
  category: CategoryOptions[];
  equipmentType: string[];
  defaults: Defaults;
  adminLists?: string[];
  licenseType: string[];
  supportTicketType: TicketType[];
  supportTicketAssetType: AssetType[];
  supportTicketIssueCategory: IssueCategory[];
}

const optionsSchema: Schema<OptionsType> = new Schema<OptionsType>({
  status: {
    type: [
      {
        value: { type: String, required: true },
        color: { type: String, required: false },
        tracked: { type: Boolean, required: false },
      },
    ],
    required: true,
  },
  category: {
    type: [
      {
        value: { type: String, required: true },
        properties: { type: [String], required: false },
        type: { type: String, required: false },
      },
    ],
    required: true,
  },
  equipmentType: { type: [String], required: true },
  licenseType: { type: [String], required: false },
  defaults: {
    type: {
      status: { type: String, required: false },
      category: { type: String, required: false },
      softwareCategory: { type: String, required: false },
      hardwareCategory: { type: String, required: false },
      equipmentType: { type: String, required: false },
      deployableStatus: { type: [String], required: false },
      retrievableStatus: { type: String, required: false },
      inventoryColumns: { type: [String], required: false },
      supportTicketType: { type: String, required: false },
    },
  },
  adminLists: { type: [String], required: false },
  supportTicketType: {
    type: [String],
    required: true,
    enum: Object.values(TicketType),
  },
  supportTicketAssetType: {
    type: [String],
    required: true,
    enum: Object.values(AssetType),
  },
  supportTicketIssueCategory: {
    type: [String],
    required: true,
    enum: Object.values(IssueCategory),
  },
});

const Option = mongoose.model<OptionsType>("Options", optionsSchema);

export default Option;
