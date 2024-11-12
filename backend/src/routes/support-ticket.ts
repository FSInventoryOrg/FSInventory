import express, { Request, Response } from "express";
import { validationResult } from "express-validator";

const router = express.Router();

router.get("/", [], async (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Hello World",
    status: "OK",
  });
});

router.post("/", [], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  
  return res.status(200).json({
    json: "POST Success",
    status: "OK",
  });
});

export default router;
