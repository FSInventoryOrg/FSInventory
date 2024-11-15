import mongoose from "mongoose";
import { ISupportTicket } from "../models/support-ticket.schema";

const getAllowedFields = (
  schema: mongoose.Schema,
  baseSchemaFields: string[],
  omittedFields: string[] = []
): string[] => {
  const allFields = Object.keys(schema.paths);
  // allow fields that are part of the base interface
  // except for omitted fields.
  return allFields.concat(
    baseSchemaFields.filter((field) => {
      return !omittedFields.includes(field);
    })
  );
};

const generateActivityLogDetails = (
  currentTicket: ISupportTicket,
  ticketInfo: Partial<ISupportTicket>
) => {
  const activityDetails = [];
  if (ticketInfo.status && ticketInfo.status !== currentTicket.status) {
    activityDetails.push(
      `${ticketInfo.updatedBy} changed the status from "${currentTicket.status}" to "${ticketInfo.status}".`
    );
  }

  if (ticketInfo.priority && ticketInfo.priority !== currentTicket.priority) {
    activityDetails.push(
      `${ticketInfo.updatedBy} changed the priority from "${currentTicket.priority}" to "${ticketInfo.priority}".`
    );
  }

  if (ticketInfo.notes && ticketInfo.notes !== currentTicket.notes) {
    activityDetails.push(`${ticketInfo.updatedBy} updated the notes.`);
  }

  return {
    activityInformation: activityDetails.join(" "),
    status: ticketInfo.status || currentTicket.status,
    notes: ticketInfo.notes || currentTicket.notes,
    priority: ticketInfo.priority || currentTicket.priority,
    updatedAt: new Date(),
    updatedBy: ticketInfo.updatedBy,
  };
};

export { getAllowedFields, generateActivityLogDetails };
