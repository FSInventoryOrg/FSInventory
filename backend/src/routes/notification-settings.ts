import express, { Request, Response } from "express";
import verifyToken, { verifyRole } from "../middleware/auth";
import { check, validationResult } from "express-validator";
import NotificationSettings from "../models/notification-settings.schema";
import User from "../models/user.schema";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    try {
      const notificationSettings = await NotificationSettings.findOne();

      if (!notificationSettings) {
        return res.json({ daysBeforeLicenseExpiration: 5 });
      }

      return res.json(notificationSettings);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Failed to fetch notification settings" });
    }
  }
);

router.post(
  "/",
  check("daysBeforeLicenseExpiration")
    .isInt({ min: 1, max: 365 })
    .withMessage(
      "daysBeforeLicenseExpiration must be a number between 1 and 365"
    ),
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { daysBeforeLicenseExpiration } = req.body;

      const notificationSettings = await NotificationSettings.findOne();
      const currentUser = await User.findOne({ _id: req.user.userId });
      const currentDate = new Date();

      const newData = {
        daysBeforeLicenseExpiration,
        updated: currentDate,
        updatedBy: currentUser
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : undefined,
      };

      const filter = notificationSettings
        ? { _id: notificationSettings._id }
        : {};

      await NotificationSettings.updateOne(
        filter,
        {
          $set: newData,
          $setOnInsert: {
            created: currentDate,
            createdBy: currentUser
              ? `${currentUser.firstName} ${currentUser.lastName}`
              : undefined,
          },
        },
        { upsert: true }
      );
      return res
        .status(200)
        .json({ message: "Successfully updated notification setting." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
