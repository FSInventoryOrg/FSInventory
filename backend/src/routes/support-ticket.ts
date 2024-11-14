import express, { Request, Response } from "express";
import {
  SupportTicketModel,
  AssetRequestTicketModel,
  TicketType,
  IssueReportTicketModel,
  TicketPriority,
  SupportTicketLog,
  TicketStatus,
} from "../models/support-ticket.schema";
import {
  TicketRequestBody,
  validateCreateFields,
  validateSupportTicket,
  validateUpdaterFields,
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

router.get(
  "/:ticketId",
  verifyToken,
  async (req: Request<{ ticketId: string }>, res: Response) => {
    const { ticketId } = req.params;
    try {
      const supportTicket = await SupportTicketModel.findOne({
        ticketId: ticketId,
      });
      if (!supportTicket) {
        return res.status(404).json({
          status: 404,
          message: "Support Ticket not found.",
        });
      }

      return res.status(200).json({
        status: 200,
        data: supportTicket,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Error retrieving the ticket.",
        error: error,
      });
    }
  }
);

router.post(
  "/",
  verifyToken,
  validateCreateFields(),
  validateSupportTicket,
  async (req: Request<object, object, TicketRequestBody>, res: Response) => {
    const ticketInfo = req.body;
    try {
      const initialLog: SupportTicketLog = {
        activityInformation: `${ticketInfo.createdBy} submitted a support ticket.`,
        status: ticketInfo.status || TicketStatus.PendingManager,
        notes: ticketInfo.notes || "",
        priority: TicketPriority.Low,
        updatedAt: new Date(),
        updatedBy: ticketInfo.createdBy,
      };
      const newTicketData = {
        ...ticketInfo,
        activityLog: [initialLog],
      };

      let _ticket;
      if (ticketInfo.type === TicketType.IssueReport) {
        _ticket = new IssueReportTicketModel(newTicketData);
      } else {
        _ticket = new AssetRequestTicketModel(newTicketData);
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

router.put(
  "/:ticketId",
  verifyToken,
  verifyRole("ADMIN"),
  validateUpdaterFields,
  async (
    req: Request<{ ticketId: string }, object, TicketRequestBody>,
    res: Response
  ) => {
    const { ticketId } = req.params;
    const ticketInfo = req.body;

    try {
      const currentTicket = await SupportTicketModel.findOne({
        ticketId: ticketId,
      });
      if (!currentTicket) {
        return res.status(404).json({
          status: 404,
          message: "Support Ticket not found.",
        });
      }

      const newLogEntry: SupportTicketLog = {
        activityInformation: `${ticketInfo.updatedBy} updated this support ticket.`,
        status: ticketInfo.status || currentTicket.status,
        notes: ticketInfo.notes || currentTicket.notes,
        priority: ticketInfo.priority || currentTicket.priority,
        updatedAt: new Date(),
        updatedBy: ticketInfo.updatedBy,
      };

      const updatedTicket = await SupportTicketModel.findOneAndUpdate(
        { ticketId: ticketId },
        {
          $set: ticketInfo,
          $push: { activityLog: newLogEntry },
        },
        { new: true, runValidators: true }
      );
      return res.status(200).json({
        status: 200,
        data: updatedTicket,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error updating the support ticket.",
        error: error,
      });
    }
  }
);

export default router;
