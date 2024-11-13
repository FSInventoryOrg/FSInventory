import express, { Request, Response } from "express";
import {
  SupportTicketModel,
  AssetRequestTicketModel,
  TicketType,
  IssueReportTicketModel,
} from "../models/support-ticket.schema";
import {
  TicketRequestBody,
  validateExtraFields,
  validateSupportTicket,
} from "../middleware/support-ticket";
import verifyToken, { verifyRole } from "../middleware/auth";

const router = express.Router();

router.get("/", [], async (req: Request, res: Response) => {
  const tickets = await SupportTicketModel.find();
  return res.status(200).json({
    message: "Hello World",
    status: "OK",
    items: tickets,
  });
});

router.post(
  "/",
  verifyToken,
  validateExtraFields(),
  validateSupportTicket,
  async (req: Request<object, object, TicketRequestBody>, res: Response) => {
    const ticketInfo = req.body;

    try {
      let _ticket;
      if (ticketInfo.type === TicketType.IssueReport) {
        _ticket = new IssueReportTicketModel(ticketInfo);
      } else {
        _ticket = new AssetRequestTicketModel(ticketInfo);
      }

      const saved = await _ticket.save();
      return res.status(201).json({
        status: 201,
        data: saved,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Error creating a ticket.",
        error: error,
      });
    }
  }
);

// status, priority???, add notes?????
router.put(
  "/:ticketId", // specifies which support ticket is needed to be updated
  verifyToken,
  verifyRole("ADMIN"),
  validateExtraFields([]), // no restrictedFields for ADMINS
  async (req: Request<object, object, TicketRequestBody>, res: Response) => {
    return res.status(200).json({
      message: "HELLO WORLD",
      status: 200,
    });
  }
);

export default router;
