import {
  IAssetRequestTicket,
  IIssueReportTicket,
  TicketType,
} from "../models/support-ticket.schema";

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
