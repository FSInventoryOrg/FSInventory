import { body, ValidationChain } from "express-validator";
import { getAllowedFields } from "../utils/support-ticket";
import {
  assetRequestSchema,
  issueReportSchema,
  supportTicketSchema,
  TicketType,
} from "../models/support-ticket.schema";

// validation rules for creating all ticket types
const supportTicketValidation: ValidationChain[] = [
  body("employeeName").notEmpty().withMessage("Employee name is required."),
  body("employeeEmail").isEmail().withMessage("Employee email must be valid."),
  body("managerEmail").isEmail().withMessage("Manager email must be valid."),
  body("managerName").notEmpty().withMessage("Manager name is required."),
  body("supportingFiles")
    .optional()
    .isArray()
    .withMessage("Supporting files must be an array of URLs."),
  body("supportingFiles.*")
    .optional()
    .isURL()
    .withMessage("Each supporting file must be a valid URL."),
  body("type")
    .isIn(["Issue Report", "Asset Request"])
    .withMessage("Ticket type must be either Issue Report or Asset Request."),
  body("status")
    .isIn([
      "Pending Manager Approval",
      "Rejected",
      "Pending IT Action",
      "Resolved",
    ])
    .withMessage(
      "Status must be either Pending Manager Approval, Rejected, Pending IT Action, or Resolved."
    ),
  body("createdBy")
    .notEmpty()
    .withMessage(
      "You must provide the person who created this support ticket."
    ),
];

// Additional validatiton for Issue Report Ticket
const issueReportValidation: ValidationChain[] = [
  ...supportTicketValidation,
  body("issueCategory")
    .notEmpty()
    .withMessage("Issue category is required for Issue Report tickets."),
  body("assetAffected")
    .optional()
    .isString()
    .withMessage("Asset affected must be a string."),
  body("issueDescription")
    .notEmpty()
    .withMessage("Issue description is required for Issue Report tickets."),
];

// Additional validation for Asset Request tickets
const requestNewAssetValidation: ValidationChain[] = [
  ...supportTicketValidation,
  body("assetType")
    .notEmpty()
    .withMessage("Asset type is required for Asset Request tickets."),
  body("assetSpecsModel")
    .notEmpty()
    .withMessage("Asset specs/model is required for Asset Request tickets."),
  body("justification")
    .notEmpty()
    .withMessage(
      "Justification for the request is required for Asset Request tickets."
    ),
  body("requestedDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Requested date must be a valid date in ISO format."),
];

// Fields that are part of the base interface
const supportTicketSchemaFields = Object.keys(supportTicketSchema.paths);
const adminOnlyFields = ["priority", "notes"];

// Fields that are allowed in the create ticket API for each ticket type
const allowedFieldsMap = {
  [TicketType.IssueReport]: getAllowedFields(
    issueReportSchema,
    supportTicketSchemaFields,
    adminOnlyFields
  ),
  [TicketType.AssetRequest]: getAllowedFields(
    assetRequestSchema,
    supportTicketSchemaFields,
    adminOnlyFields
  ),
};

export {
  supportTicketValidation,
  issueReportValidation,
  requestNewAssetValidation,
  allowedFieldsMap,
};
