import express, { Request, Response } from "express";
import verifyToken, { verifyRole } from "../middleware/auth";
import AutoMail, { AutoMailType } from "../models/automail.schema";
import mongoose from "mongoose";
import { createExcelTable, saveFile } from "../utils/common";
import { AutoMailReportTemplate } from "../reports-template/mail/auto-mail-report";
import Employee from "../models/employee.schema";
import Asset from "../models/asset.schema";
import { sendMail } from "./mailer";
import { inventoryReportHtml } from "../reports-template/mail/reports";
import { extractDocuments } from "./backup";

const router = express.Router();
let activationTimeout: string | number | NodeJS.Timeout | undefined;

const activateAutoMailing = async (data: any, now?: boolean) => {
  const dateReference =
    data["nextRoll"] && !now ? new Date(data["nextRoll"]) : new Date();
  const recipients = data["recipient"];

  const allEmployees = await Employee.aggregate().match({});
  const allHardwareAssets = await Asset.aggregate().match({ type: "Hardware" });

  const source = allHardwareAssets.reduce((accum: any, value: any) => {
    if (value.assignee) {
      const findEmployee = allEmployees.find(
        (f) => f["code"] === value.assignee
      );

      if (findEmployee)
        value["assignee"] =
          `${findEmployee["first_name"]} ${findEmployee["last_name"]}`;
    }
    if (value.recoveredFrom) {
      const findEmployee = allEmployees.find(
        (f) => f["code"] === value.recoveredFrom
      );

      if (findEmployee)
        value["recoveredFrom"] =
          `${findEmployee["first_name"]} ${findEmployee["last_name"]}`;
    }

    value["purchaseDate"] =
      new Date(value["purchaseDate"]).toString() !== "Invalid Date"
        ? new Date(value["purchaseDate"]).toISOString()
        : "";
    value["deploymentDate"] =
      new Date(value["deploymentDate"]).toString() !== "Invalid Date"
        ? new Date(value["deploymentDate"]).toISOString()
        : "";
    value["recoveryDate"] =
      new Date(value["recoveryDate"]).toString() !== "Invalid Date"
        ? new Date(value["recoveryDate"]).toISOString()
        : "";

    value["isRGE"] = value["isRGE"] ? "TRUE" : "FALSE";

    accum.push(value);
    return accum;
  }, []);

  const excelTable = await createExcelTable(source, AutoMailReportTemplate);

  const tableFile = await saveFile(
    "/public/attachments",
    "Assets.xlsx",
    excelTable,
    true
  );
  const backupFile = await extractDocuments();
  const htmlMessage = await inventoryReportHtml(data);
  await sendMail({
    subject: `Full Scale Stockpilot: Inventory Report (Date Generated ${dateReference.toLocaleDateString()})`,
    htmlMessage: htmlMessage,
    recipient: recipients,
    attachments: [tableFile, backupFile.pathFile],
  });
  const rollOut = new Date();
  await AutoMail.updateOne(
    { _id: data._id },
    { lastRollOut: rollOut },
    { upsert: true }
  );
};

const nextRollComputatuion = (doc: AutoMailType, referenceDate?: Date) => {
  const dateNow = referenceDate ? new Date(referenceDate) : new Date();
  let timeConstraint: Date = new Date(dateNow.getTime() + 28800000);

  const anticipateDate = (year: number, month: number, day: number) => {
    if (month > 12) {
      year++;
      month = 1;
    }

    let validDate = "";
    let isValidDate = false;

    while (!isValidDate) {
      validDate = `${year}/${month}/${day}`;
      const checkDate = new Date(validDate);
      isValidDate = checkDate.toString() !== "Invalid Date";

      if (isValidDate && month === checkDate.getMonth() + 1) isValidDate = true;
      else {
        isValidDate = false;
        day--;
      }
    }

    return new Date(validDate);
  };

  if (doc["frequency"] === "Daily") {
    timeConstraint = new Date(
      new Date(
        `${timeConstraint.toISOString().split("T")[0]}T${doc["time"]}:00.000Z`
      ).getTime() - 28800000
    );
    if (timeConstraint < dateNow)
      timeConstraint = new Date(timeConstraint.getTime() + 86400000);
  } else if (doc["frequency"] === "Weekly") {
    const weekDiff = (doc["weekday"] - timeConstraint.getDay()) * 86400000;

    timeConstraint = new Date(timeConstraint.getTime() + weekDiff);
    timeConstraint = new Date(
      new Date(
        `${timeConstraint.toISOString().split("T")[0]}T${doc["time"]}:00.000Z`
      ).getTime() - 28800000
    );
    if (timeConstraint < dateNow)
      timeConstraint = new Date(timeConstraint.getTime() + 604800000);
  } else if (doc["frequency"] === "Bi-Weekly") {
    const weekDiff = (doc["weekday"] - timeConstraint.getDay()) * 86400000;

    timeConstraint = new Date(timeConstraint.getTime() + weekDiff);
    timeConstraint = new Date(
      new Date(
        `${timeConstraint.toISOString().split("T")[0]}T${doc["time"]}:00.000Z`
      ).getTime() - 28800000
    );
    if (timeConstraint < dateNow)
      timeConstraint = new Date(timeConstraint.getTime() + 1209600000);
  } else if (doc["frequency"] === "Monthly") {
    const _y = timeConstraint.getFullYear();
    let _m = timeConstraint.getMonth() + 1;

    let anticipatedDate: Date = anticipateDate(_y, _m, doc["day"]);
    timeConstraint = new Date(
      new Date(
        `${anticipatedDate.toISOString().split("T")[0]}T${doc["time"]}:00.000Z`
      ).getTime() - 28800000
    );

    if (timeConstraint < dateNow) {
      anticipatedDate = anticipateDate(_y, ++_m, doc["day"]);
      timeConstraint = new Date(
        new Date(
          `${anticipatedDate.toISOString().split("T")[0]}T${doc["time"]}:00.000Z`
        ).getTime() - 28800000
      );
    }
  }

  doc["nextRoll"] = timeConstraint;

  return doc;
};

export const renewAutoMailingActivation = async () => {
  clearTimeout(activationTimeout);

  const existingSettings: any = await AutoMail.findOne({});

  if (existingSettings) {
    const idToUsed = existingSettings._id;
    const newData = nextRollComputatuion(existingSettings);
    delete existingSettings._id;

    await AutoMail.updateOne({ _id: idToUsed }, newData, { upsert: true });

    const timeout =
      new Date(newData["nextRoll"]).getTime() - new Date().getTime();

    console.log(
      "Auto genereated report will roll out on",
      new Date(
        new Date(newData["nextRoll"]).getTime() + 28800000
      ).toLocaleString("en-PH")
    );

    activationTimeout = setTimeout(async () => {
      const rollOut = new Date();
      await activateAutoMailing(newData);
      await AutoMail.updateOne(
        { _id: idToUsed },
        { lastRollOut: rollOut },
        { upsert: true }
      );

      renewAutoMailingActivation();
    }, timeout);
  }
};

router.post(
  "/",
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    try {
      const { user } = req.cookies;

      const currentUser: any = JSON.parse(user);

      const doc: any = req.body;

      if (!doc)
        return res.status(422).json({ message: "Cannot process the payload" });

      let newData: any = {
        frequency: doc["frequency"],
        day: doc["day"],
        weekday: doc["weekday"],
        time: doc["time"],
        recipient: doc["recipient"],
        contact: doc["contact"],
      };

      let existingSettings: any = await AutoMail.aggregate().match({});

      existingSettings = existingSettings ? existingSettings[0] : null;

      const idToUsed = existingSettings
        ? existingSettings._id
        : new mongoose.Types.ObjectId();

      if (existingSettings) delete existingSettings._id;

      newData = nextRollComputatuion({ ...existingSettings, ...newData });

      if (!newData.created) {
        newData["created"] = new Date();
        newData["createdby"] =
          `${currentUser["first_name"]} ${currentUser["last_name"]}`;
      }
      newData["updated"] = new Date();
      newData["updatedby"] =
        `${currentUser["first_name"]} ${currentUser["last_name"]}`;

      await AutoMail.updateOne({ _id: idToUsed }, newData, { upsert: true });

      await renewAutoMailingActivation();

      return res.status(200).json({
        message: "Auto generated mail reports configurations has been set",
        data: newData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
  }
);

router.get(
  "/",
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    try {
      const existingSettings: any = await AutoMail.findOne({});

      if (!existingSettings)
        return res.status(404).json({ message: "Auto mail is not yet set" });
      return res.status(200).json(existingSettings);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
  }
);

router.post(
  "/activateNow",
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    try {
      const autoMailData = await AutoMail.findOne({});
      await activateAutoMailing(autoMailData, true);

      return res.status(200).json({
        message: "Auto generated mail reports has been manually triggered",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong", error });
    }
  }
);

export default router;
