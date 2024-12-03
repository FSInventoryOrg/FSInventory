export enum TicketStatus {
  PendingManager = "Pending Manager Approval",
  Rejected = "Rejected",
  PendingIT = "Pending IT Action",
  Resolved = "Resolved",
}
export type TicketStatusType = `${TicketStatus}`;

export interface SupportTicket {
  ticketId: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  type: "Asset Request" | "Issue Report";
  employeeName: string;
  managerName: string;
  employeeEmail: string;
  priority?: PriorityLevel;
  status?: TicketStatusType;
}

export interface ReportIssueType extends SupportTicket {
  type: "Issue Report";
  issueCategory: string;
  assetAffected?: string;
  issueDescription: string;
  supportingFiles?: string[];
}

export interface RequestAssetType extends SupportTicket {
  type: "Asset Request";
  assetType: string;
  assetSpecsModel: string;
  justification: string;
  requestedDate?: Date;
}

export type SupportTicketType = ReportIssueType | RequestAssetType;

export const PRIORITY_LEVELS = ["High", "Medium", "Low"] as const;
export type PriorityLevels = typeof PRIORITY_LEVELS;
export type PriorityLevel = PriorityLevels[number];
