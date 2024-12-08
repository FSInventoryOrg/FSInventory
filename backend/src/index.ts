import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import assetRoutes from "./routes/assets";
import assetCounterRoutes from "./routes/asset-counter";
import optionRoutes from "./routes/options";
import employeeRoutes from "./routes/employees";
import uploadRoutes from "./routes/upload";
import downloadRoutes from "./routes/download";
import notificationRoutes from "./routes/notification";
import notificationSettingRoutes from "./routes/notification-settings";
import supportTicketRoutes from "./routes/support-ticket";
import configRoutes from "./system/config";

import logger from "./utils/logger";
import swaggerDocs from "./utils/swagger";
import { startChangeStream } from "./utils/change-stream";
import { auditAssets } from "./utils/common";
import {
  autoMail,
  convertStatusToStorage,
  convertStatusToUnaccounted,
  getVersions,
  removeStatus,
  rotateLogs,
  setDefaults,
  softwareExpirationMonitoring,
} from "./system/jobs";
import autoMailRoutess from "./system/automail";
import backupRoutes, { listCollection } from "./system/backup";
import versionRoutes from "./system/version";
import path from "path";

const DEFAULT_PORT = 3000;
const port = Number(process.env.PORT) || DEFAULT_PORT;

const HOST = (process.env.HOST as string) || "localhost";
const FRONTEND_BUILD_LOCATION = "../../frontend/dist";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
const db = mongoose.connection;

db.on("connected", () => {
  logger.info("Connected to MongoDB");
});

db.on("error", (err) => {
  logger.error("MongoDB connection error:", err);
});

startChangeStream();

const app = express();

app.use(express.static(path.join(__dirname, FRONTEND_BUILD_LOCATION)));
app.use(cookieParser());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/options", optionRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/assetcounter", assetCounterRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/notification_settings", notificationSettingRoutes);
app.use("/api/support_ticket", supportTicketRoutes);
app.use("/config", configRoutes);
app.use("/autoMail", autoMailRoutess);
app.use("/backup", backupRoutes);
app.use("/version", versionRoutes);
app.use("/healthcheck", (_, res) =>
  res.send("Inventory backend is running...")
);

// Catch-all route for unmatched URLs
if (process.env.NODE_ENV !== "development") {
  app.get("/*", function (req, res) {
    res.sendFile(
      path.join(__dirname, `${FRONTEND_BUILD_LOCATION}/index.html`),
      function (err) {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  });
}

const isAtlasDB = () => {
  return process.env.MONGODB_CONNECTION_STRING?.startsWith("mongodb+srv://");
};

const onStartupJobs = async () => {
  await getVersions();
  if (!isAtlasDB()) rotateLogs();
  await removeStatus();
  await setDefaults();
  await convertStatusToStorage();
  await convertStatusToUnaccounted();
  await auditAssets();
  await autoMail();
  await listCollection();

  softwareExpirationMonitoring();
};

onStartupJobs();

app.listen(port, HOST, () => {
  logger.info(`Server running on http://${HOST}:${port}`);
  swaggerDocs(app, port);
});
