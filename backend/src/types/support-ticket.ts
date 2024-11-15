/* eslint-disable no-unused-vars */
import {
  IAssetRequestTicket,
  IIssueReportTicket,
} from "../models/support-ticket.schema";

export enum SupportTicketPrefix {
  IssueReport = "IR",
  AssetRequest = "AR",
}

export enum TicketType {
  IssueReport = "Issue Report",
  AssetRequest = "Asset Request",
}

export enum TicketStatus {
  PendingManager = "Pending Manager Approval",
  Rejected = "Rejected",
  PendingIT = "Pending IT Action",
  Resolved = "Resolved",
}

export enum TicketPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export enum AssetType {
  Hardware = "Hardware",
  Software = "Software",
  Network = "Network",
}

export enum IssueCategory {
  Hardware = "Hardware",
  Software = "Software",
  Network = "Network",
  Communication = "Communication",
  Security = "Security",
}

export type SupportTicketLog = {
  activityInformation?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  notes?: string;
  updatedBy?: string;
  updatedAt: Date;
};

// Define a mapping from ticket type to its corresponding interface
export type TicketTypeMap = {
  [TicketType.IssueReport]: IIssueReportTicket;
  [TicketType.AssetRequest]: IAssetRequestTicket;
};

// Type for the request body based on the ticket type
export type TicketRequestBody<T extends TicketType = TicketType> =
  TicketTypeMap[T];

export interface TicketQueryParams {
  page?: string;
  limit?: string;
  type?: string;
  status?: string;
  query?: string;
}
