import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  SupportTicketModel,
  AssetRequestTicketModel,
  TicketStatus,
  TicketType,
  AssetType,
  IAssetRequestTicket,
} from "../models/support-ticket.schema";

const router = express.Router();

router.get("/", [], async (req: Request, res: Response) => {
  const tickets = await SupportTicketModel.find();
  return res.status(200).json({
    message: "Hello World",
    status: "OK",
    items: tickets,
  });
});

router.post("/", [], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const _supportTicketModel = new AssetRequestTicketModel<IAssetRequestTicket>({
    type: TicketType.AssetRequest,
    assetSpecsModel: "Macbook M3",
    assetType: AssetType.Hardware,
    employeeEmail: "katarinayu@gmail.com",
    employeeName: "Katarina Yu",
    createdBy: "Katarina Yu",
    updatedBy: "Katarina Yu",
    justification: "I need a Macbook, pls",
    managerEmail: "manager@gmail.com",
    managerName: "My Manager",
    status: TicketStatus.PendingManager,
  });
  const saved = await _supportTicketModel.save();

  return res.status(200).json({
    json: "POST Success",
    status: "OK",
    item: saved,
  });
});

export default router;
