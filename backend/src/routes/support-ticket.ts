import express, { Request, Response } from "express";
import {
  SupportTicketModel,
  AssetRequestTicketModel,
  IssueReportTicketModel,
  ISupportTicket,
} from "../models/support-ticket.schema";
import {
  validateCreateFields,
  validateSupportTicket,
  validateUpdaterFields,
} from "../middleware/support-ticket";
import {
  TicketQueryParams,
  TicketRequestBody,
  TicketType,
  TicketPriority,
  SupportTicketLog,
  TicketStatus,
  ApprovalQueryParams,
} from "../types/support-ticket";
import { FilterQuery } from "mongoose";
import verifyToken, { verifyRole } from "../middleware/auth";
import { generateActivityLogDetails } from "../utils/support-ticket";
import { generateSupportTicketHTML } from "../templates/support-ticket/support-ticket-mail";
import { sendMail } from "../system/mailer";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  async (
    req: Request<object, object, object, TicketQueryParams>,
    res: Response
  ) => {
    const { page = 1, limit = 10, type, status, query } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const filters: FilterQuery<ISupportTicket> = {};
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (query) {
      filters.$or = [
        "ticketId",
        "createdBy",
        "employeeName",
        "employeeEmail",
        "assetSpecsModel",
        "assetAffected",
      ].map((field) => ({
        [field]: { $regex: query, $options: "i" },
      }));
    }

    try {
      // the number of tickets that match the filters
      const totalTickets = await SupportTicketModel.countDocuments(filters);
      const tickets = await SupportTicketModel.find(filters)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

      const totalPages = Math.ceil(totalTickets / limitNumber);
      return res.status(200).json({
        status: 200,
        data: tickets,
        pagination: {
          totalTickets: totalTickets,
          totalPages: totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Error retrieving the support tickets.",
        error: error,
      });
    }
  }
);

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
      if (newTicketData.type === TicketType.IssueReport) {
        _ticket = new IssueReportTicketModel(newTicketData);
      } else {
        _ticket = new AssetRequestTicketModel(newTicketData);
      }

      const saved = await _ticket.save();
      // respond to the client as soon as the ticket is saved :)
      res.status(201).json({
        status: 201,
        data: saved,
      });

      // send an email. This is better handled in a webhook or in a separate process
      // so an error regarding email sending is handled separately.
      try {
        const htmlMessage = await generateSupportTicketHTML(saved);
        await sendMail({
          subject: "An employee has submitted an IT Support Ticket",
          htmlMessage: htmlMessage,
          recipient: ticketInfo.managerEmail,
          attachments: [],
        });
      } catch (emailError) {
        // Should log this event separately
        console.log("Error sending an email:", emailError);
      }
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

      const newLogEntry = generateActivityLogDetails(currentTicket, ticketInfo);
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

router.get(
  "/:ticketId/approve",
  async (
    req: Request<{ ticketId: string }, object, object, { token: string }>,
    res: Response
  ) => {
    const { ticketId } = req.params;
    const { token } = req.query;

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      ) as ApprovalQueryParams;

      // Ensure that the ticketId param is not modified
      if (ticketId !== decoded.ticketId) {
        return res.status(403).json({
          status: 403,
          message: "Unauthorized: Invalid Support Ticket.",
        });
      }

      const ticket = await SupportTicketModel.findOne({ ticketId });
      if (!ticket) {
        return res.status(404).json({
          status: 404,
          message: "Support Ticket not found.",
        });
      }

      // Ensure the manager email matches
      if (ticket.managerEmail !== decoded.managerEmail) {
        return res.status(403).json({
          status: 403,
          message:
            "Unauthorized: You are not the manager assigned to this ticket.",
        });
      }

      if (ticket.status !== TicketStatus.PendingManager) {
        return res.status(400).json({
          status: 400,
          message: "This support ticket has already been processed.",
        });
      }

      // Update the ticket status and who updated the ticket; and also
      // create an activity log for the support ticket
      const updatedFields = {
        status: TicketStatus.PendingIT,
        updatedBy: ticket.managerName,
      };
      const newLogEntry = generateActivityLogDetails(ticket, updatedFields);
      const updatedTicket = await SupportTicketModel.findOneAndUpdate(
        { ticketId: ticketId },
        {
          $set: updatedFields,
          $push: { activityLog: newLogEntry },
        },
        { new: true, runValidators: true }
      );

      // Instead of a JSON object, we can show a UI or some sort to the user
      return res.status(200).json({
        status: 200,
        message: "Support Ticket is approved by the manager.",
        data: updatedTicket,
      });
    } catch (error) {
      console.error("Error approving ticket:", error);
      if ((error as JsonWebTokenError).name === "JsonWebTokenError") {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized: Invalid Token.",
        });
      }

      if ((error as TokenExpiredError).name === "TokenExpiredError") {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized: Token expired.",
        });
      }

      return res.status(500).json({
        status: 500,
        message: "An error occured while approving the ticket.",
      });
    }
  }
);

router.post("/test", async (req: Request, res: Response) => {
  //
  // const htmlMessage = await generateSupportTicketHTML();
  try {
    // await sendMail({
    //   subject: "An employee has submitted an IT Support Ticket",
    //   htmlMessage: htmlMessage,
    //   recipient: "hcesa@fullscale.ph",
    //   attachments: [],
    // });

    return res.status(200).json({
      status: 200,
      message: "Email sent successfully",
      // htmlMessage: htmlMessage,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong",
      error: err,
    });
  }
});

export default router;
