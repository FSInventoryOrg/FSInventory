import express, { Request, Response } from 'express';
import cors from 'cors'
import "dotenv/config";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import assetRoutes from './routes/assets'
import optionRoutes from './routes/options'
import employeeRoutes from './routes/employees'
import logger from './utils/logger';
import swaggerDocs from './utils/swagger';
import { startChangeStream } from './utils/change-stream';
import path from 'path';

const DEFAULT_PORT = 3000;
const port = Number(process.env.PORT) || DEFAULT_PORT;

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

app.use(express.static(path.join(__dirname, "../../../stockpilot-frontend/dist")))

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/assets", assetRoutes)
app.use("/api/options", optionRoutes)
app.use("/api/employees", employeeRoutes)

app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`)
  swaggerDocs(app, port);
})