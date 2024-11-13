import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import {
  IAssetRequestTicket,
  IIssueReportTicket,
  TicketType,
} from "../models/support-ticket.schema";
import {
  allowedFieldsMap,
  issueReportValidation,
  requestNewAssetValidation,
} from "../validation/support-ticket";

// Define a mapping from ticket type to its corresponding interface
type TicketTypeMap = {
  [TicketType.IssueReport]: IIssueReportTicket;
  [TicketType.AssetRequest]: IAssetRequestTicket;
};

// Type for the request body based on the ticket type
type TicketRequestBody<T extends TicketType> = TicketTypeMap[T];

// Middleware to apply correct validation based on ticket type
const validateSupportTicket = <T extends TicketType>(
  req: Request<{}, {}, TicketRequestBody<T>>,
  res: Response,
  next: NextFunction
) => {
  const { type } = req.body;

  let validations: ValidationChain[];
  if (type === TicketType.IssueReport) {
    validations = issueReportValidation;
  } else if (type === TicketType.AssetRequest) {
    validations = requestNewAssetValidation;
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

// Middleware to apply validation for extra fields for support ticket
const validateExtraFields = <T extends TicketType>(
  req: Request<{}, {}, TicketRequestBody<T>>,
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
  // This isnt actually needed, but it's better to be safe
  if (!allowedFieldsForType) {
    return res.status(400).json({
      status: 400,
      message: "Invalid ticket type.",
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

export { validateSupportTicket, validateExtraFields };
