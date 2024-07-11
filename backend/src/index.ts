import express, { Request, Response } from 'express';
import cors from 'cors'
import "dotenv/config";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import assetRoutes from './routes/assets'
import assetCounterRoutes from './routes/asset-counter'
import optionRoutes from './routes/options'
import employeeRoutes from './routes/employees'
import uploadRoutes from './routes/upload'
import downloadRoutes from './routes/download'

import logger from './utils/logger';
import swaggerDocs from './utils/swagger';
import { startChangeStream } from './utils/change-stream';
import path from 'path';

const DEFAULT_PORT = 3000;
const port = Number(process.env.PORT) || DEFAULT_PORT;

const HOST = (process.env.HOST as string) || `localhost`;
const FRONTENDLOC = `../../frontend/dist`;

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
const db = mongoose.connection;

db.on('connected', () => {
  logger.info('Connected to MongoDB');
});

db.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

startChangeStream();

const app = express();

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))

app.use(express.static(path.join(__dirname, FRONTENDLOC)))

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/assets", assetRoutes)
app.use("/api/options", optionRoutes)
app.use("/api/employees", employeeRoutes)
app.use("/api/assetcounter", assetCounterRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/download", downloadRoutes)

// Catch-all route for unmatched URLs (place it here)
if (process.env.NODE_ENV !== 'development') {
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, `${FRONTENDLOC}/index.html`), function(err) {
      if (err) {
        res.status(500).send(err);
      }
    });
  });
}

app.listen(port, HOST, () => {
  logger.info(`Server running on http://${HOST}:${port}`)
  swaggerDocs(app, port);
})