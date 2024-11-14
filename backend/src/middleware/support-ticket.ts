import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import {
  assetRequestSchema,
  IAssetRequestTicket,
  IIssueReportTicket,
  issueReportSchema,
  supportTicketSchema,
  TicketType,
} from "../models/support-ticket.schema";
import {
  issueReportValidation,
  assetRequestValidation,
  updaterFieldValidation,
} from "../validation/support-ticket";
import { getAllowedFields } from "../utils/support-ticket";

// Define a mapping from ticket type to its corresponding interface
export type TicketTypeMap = {
  [TicketType.IssueReport]: IIssueReportTicket;
  [TicketType.AssetRequest]: IAssetRequestTicket;
};

// Type for the request body based on the ticket type
export type TicketRequestBody<T extends TicketType = TicketType> =
  TicketTypeMap[T];

// Middleware to apply correct validation based on ticket type
const validateSupportTicket = <T extends TicketType>(
  req: Request<object, object, TicketRequestBody<T>>,
  res: Response,
  next: NextFunction
) => {
  const { type } = req.body;

  let validations: ValidationChain[];
  if (type === TicketType.IssueReport) {
    validations = issueReportValidation;
  } else if (type === TicketType.AssetRequest) {
    validations = assetRequestValidation;
  } else {
    return res.status(400).json({
      status: 400,
      message: "Invalid Ticket Type.",
    });
  }

  Promise.all(validations.map((validation) => validation.run(req))).then(() => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  });
};

// Middleware wrapper to apply validations for extra fields for support tickets
const validateExtraFields = (
  restrictedFields: string[] = [],
  options?: {
    overwriteRestrictedFields: boolean;
  }
) => {
  // Fields that are part of the base interface
  const supportTicketSchemaFields = Object.keys(supportTicketSchema.paths);
  const defaultRestrictedFields = ["priority", "notes", "status"];

  // Combine or overwrite restricted fields based on options
  let _restricted: string[] = defaultRestrictedFields.concat(restrictedFields);
  if (options?.overwriteRestrictedFields) {
    _restricted = restrictedFields;
  }

  // Fields that are allowed in the POST and PUT endpoints
  const allowedFieldsMap = {
    [TicketType.IssueReport]: getAllowedFields(
      issueReportSchema,
      supportTicketSchemaFields,
      _restricted
    ),
    [TicketType.AssetRequest]: getAllowedFields(
      assetRequestSchema,
      supportTicketSchemaFields,
      _restricted
    ),
  };

  return <T extends TicketType>(
    req: Request<object, object, TicketRequestBody<T>>,
    res: Response,
    next: NextFunction
  ) => {
    const { type } = req.body;

    // Enforce the use of the TicketType enum to validate the type
    if (!Object.values(TicketType).includes(type)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid ticket type",
      });
    }

    const allowedFieldsForType = allowedFieldsMap[type];
    if (!allowedFieldsForType) {
      return res.status(400).json({
        status: 400,
        message: "No mapping found for the specified type.",
      });
    }

    // Check if any field in the request body is not allowed
    const extraFields = Object.keys(req.body).filter(
      (field) => !allowedFieldsForType.includes(field)
    );

    if (extraFields.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Unexpected fields in the request are found.",
        extraFields: extraFields,
      });
    }

    next();
  };
};

const validateUpdaterFields = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validations = updaterFieldValidation;
  Promise.all(validations.map((validation) => validation.run(req))).then(() => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  });
};

export { validateSupportTicket, validateExtraFields, validateUpdaterFields };
