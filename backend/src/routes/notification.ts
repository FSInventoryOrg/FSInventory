import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Notification, { NotificationType } from "../models/notification.schema";
import { tokenStatus, tokenUser } from "../middleware/auth";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { auth_token: token } = req.cookies;
    const { data: user } = await (await tokenUser(token)).json();
    await tokenStatus(token);

    const notifications: any = await Notification.aggregate()
      .match({
        $expr: {
          $and: [{ $in: [user.id, "$target_users"] }],
        },
      })
      .sort({
        updated: -1,
      });

    const newData = notifications.reduce(
      (accum: NotificationType[], value: NotificationType) => {
        const singleData: any = {
          _id: value["_id"].toString(),
          message: value["message"],
          message_html: value["message_html"],
          openTab: value["openTab"],
          url: value["url"],
          date: value["updated"],
          read: value["seen_users"].includes(user.id),
        };

        accum.push(singleData);
        return accum;
      },
      []
    );

    const notifDetails = {
      unread: newData.filter((f: any) => !f["read"]).length,
      count: newData.length,
      data: newData,
    };

    return res.status(200).json(notifDetails);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.patch("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { auth_token: token } = req.cookies;
    const { data: user } = await (await tokenUser(token)).json();
    await tokenStatus(token);

    const requestBody = req.body;

    if (!Array.isArray(requestBody))
      return res
        .status(422)
        .json({ message: "Payload should be arrays of _ids" });

    const mongoIDs = requestBody.reduce((accum, value: string) => {
      const valueID = new mongoose.Types.ObjectId(value);
      accum.push(valueID);
      return accum;
    }, []);

    const notifications: any = await Notification.aggregate().match({
      $expr: {
        $and: [
          { $in: [user.id, "$target_users"] },
          { $in: ["$_id", mongoIDs] },
        ],
      },
    });

    notifications.forEach(async (notif: any) => {
      notif["seen_users"].push(user.id);
      notif["seen_users"] = notif["seen_users"].filter(
        (value: string, index: number, array: any) => {
          return array.indexOf(value) === index;
        }
      );

      await Notification.updateOne(
        { _id: notif["_id"] },
        { seen_users: notif["seen_users"] }
      );
    });

    return res.status(200).json({ message: "Successfully patched" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
