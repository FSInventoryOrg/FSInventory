import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import {
  assetRequestSchema,
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
import { TicketRequestBody } from "../types/support-ticket";

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

// Middleware wrapper that compares the fields in the request body to the
// allowed fields and rejects any unexpected fields based on the ticket type
const validateCreateFields = () => {
  // Fields that are part of the base interface
  const supportTicketSchemaFields = Object.keys(supportTicketSchema.paths);
  const restrictedFields = ["priority", "notes", "status"];

  // Fields that are allowed in the POST and PUT endpoints
  const allowedFieldsMap = {
    [TicketType.IssueReport]: getAllowedFields(
      issueReportSchema,
      supportTicketSchemaFields,
      restrictedFields
    ),
    [TicketType.AssetRequest]: getAllowedFields(
      assetRequestSchema,
      supportTicketSchemaFields,
      restrictedFields
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

// Middleware to apply validations to the request data for PUT request
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

export { validateSupportTicket, validateCreateFields, validateUpdaterFields };
