import mongoose, { Schema } from "mongoose";

enum TicketType {
  IssueReport = "Issue Report",
  AssetRequest = "Asset Request",
}

enum TicketStatus {
  PendingManager = "Pending Manager Approval",
  Rejected = "Rejected",
  PendingIT = "Pending IT Action",
  Resolved = "Resolved",
}

enum AssetType {
  Hardware = "Hardware",
  Software = "Software",
  Network = "Network",
}

enum IssueCategory {
  Hardware = "Hardware",
  Software = "Software",
  Network = "Network",
  Communication = "Communication",
  Security = "Security",
}

// Interface for the base Support Ticket
interface ISupportTicket {
  ticketId: string;
  type: TicketType;
  employeeName: string;
  employeeEmail: string;
  managerName: string;
  managerEmail: string;
  supportingFiles?: string[];
  status: TicketStatus;
  createdBy: string;
  updatedBy: string;
}

// Interface for Issue Report Ticket
interface IIssueReportTicket extends ISupportTicket {
  type: TicketType.IssueReport; // Set the specific enum value
  issueCategory: IssueCategory;
  assetAffected?: string;
  issueDescription: string;
}

// Interface for Asset Request Ticket
interface IAssetRequestTicket extends ISupportTicket {
  type: TicketType.AssetRequest; // Set the specific enum value
  assetType: AssetType;
  assetSpecsModel: string;
  justification: string;
  requestedDate?: Date;
}

// Schema for the base Support Ticket
const supportTicketSchema: Schema<ISupportTicket> = new Schema<ISupportTicket>(
  {
    type: {
      type: String,
      required: true,
      enum: Object.values(TicketType),
    },
    employeeName: {
      type: String,
      required: true,
    },
    employeeEmail: {
      type: String,
      required: true,
    },
    managerName: {
      type: String,
      required: true,
    },
    managerEmail: {
      type: String,
      required: true,
    },
    supportingFiles: {
      type: [String], // Array of file URLs
      required: false,
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(TicketStatus),
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "type",
  }
);

// Model for the base Support Ticket
const SupportTicketModel = mongoose.model<ISupportTicket>(
  "SupportTicket",
  supportTicketSchema
);

// Schema for Issue Report Ticket
const issueReportSchema: Schema<IIssueReportTicket> =
  new Schema<IIssueReportTicket>({
    issueCategory: {
      type: String,
      required: true,
      enum: Object.values(IssueCategory),
    },
    assetAffected: {
      type: String,
      required: false,
    },
    issueDescription: {
      type: String,
      required: true,
    },
  });

// Model for Issue Report Ticket
const IssueReportTicketModel =
  SupportTicketModel.discriminator<IIssueReportTicket>(
    TicketType.IssueReport,
    issueReportSchema
  );

// Schema for Asset Request Ticket
const assetRequestSchema: Schema<IAssetRequestTicket> =
  new Schema<IAssetRequestTicket>({
    assetType: {
      type: String,
      required: true,
      enum: Object.values(AssetType),
    },
    assetSpecsModel: {
      type: String,
      required: true,
    },
    justification: {
      type: String,
      required: true,
    },
    requestedDate: {
      type: Date,
      required: false,
    },
  });

// Model for Asset Request Ticket
const AssetRequestTicketModel =
  SupportTicketModel.discriminator<IAssetRequestTicket>(
    TicketType.AssetRequest,
    assetRequestSchema
  );

export {
  SupportTicketModel, // Support Ticket Base Model
  AssetRequestTicketModel, // Asset Request Model
  IssueReportTicketModel, // Issue Report Model
  TicketType, // enum
  TicketStatus, // enum
  AssetType, // enum
  IssueCategory, // enum
  ISupportTicket, // interfaces
  IIssueReportTicket, // interfaces
  IAssetRequestTicket, // interfaces
};
