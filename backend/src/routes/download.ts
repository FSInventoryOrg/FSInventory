import express, { Request, Response } from "express";
import verifyToken, { verifyRole } from "../middleware/auth";
import { getFile } from "../utils/common";
import Attachment from "../models/attachments";

const router = express.Router();

router.get(
  "/info/:id",
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    try {
      const fileID: string = req.params.id;

      const attachment = await Attachment.findOne({ _id: fileID });
      if (!attachment)
        return res.status(404).json({ message: "File not found" });

      res.status(200).json(attachment);
    } catch (error) {
      console.error("Error fetching file info:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/file/:id",
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    try {
      const fileID: string = req.params.id;

      const attachment: any = await Attachment.findOne({ _id: fileID });
      if (!attachment)
        return res.status(404).json({ message: "File not found" });

      const filesrc = await getFile(attachment["path"]);
      if (!filesrc)
        return res
          .status(404)
          .json({ message: "File does not exists anymore" });

      res
        .status(200)
        .contentType(attachment["filetype"])
        .setHeader(
          "Content-Disposition",
          `attachment; filename=${attachment["originalName"]}`
        )
        .end(filesrc);
    } catch (error) {
      console.error("Error fetching file existence:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
