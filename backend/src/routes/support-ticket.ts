import express, { Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";
import {
  SupportTicketModel,
  AssetRequestTicketModel,
  TicketStatus,
  TicketType,
  AssetType,
  IAssetRequestTicket,
  IssueReportTicketModel,
} from "../models/support-ticket.schema";
import {
  validateExtraFields,
  validateSupportTicket,
} from "../middleware/support-ticket";

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
  validateExtraFields,
  validateSupportTicket,
  async (req: Request, res: Response) => {
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

export default router;
