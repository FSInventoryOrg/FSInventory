import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import verifyToken, { verifyRole } from '../middleware/auth';
import Notification, { NotificationType } from '../models/notification.schema';
import mongoose from 'mongoose';
import { check, validationResult } from 'express-validator';
import { softwareExpirationMonitoring } from '../system/jobs';
import NotificationSettings from '../models/notification-settings.schema';
import User from '../models/user.schema';

const router = express.Router();

router.get('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const notificationSettings = await NotificationSettings.findOne().exec();
    
        // If no settings are found, return a default value (for first-time setup)
        if (!notificationSettings) {
          return res.json({ daysBeforeLicenseExpiration: 5 });
        }
    
        return res.json(notificationSettings);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch notification settings' });
      }
});

router.post(
  '/',
  check('daysBeforeLicenseExpiration')
    .isInt({ min: 1, max: 365 })
    .withMessage(
      'daysBeforeLicenseExpiration must be a number between 1 and 365'
    ),
  verifyToken,
  verifyRole('ADMIN'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { daysBeforeLicenseExpiration } = req.body;

      let notificationSettings = await NotificationSettings.findOne();
      const currentUser = await User.findOne({ _id: req.user.userId });
      const currentDate = new Date();

      if (!notificationSettings) {
        notificationSettings = new NotificationSettings({daysBeforeLicenseExpiration});
        notificationSettings.created = currentDate;
        if (currentUser) {
            notificationSettings.createdBy = `${currentUser.firstName} ${currentUser.lastName}`;
        }
      }

      notificationSettings.updated = currentDate;
      if (currentUser) {
        notificationSettings.updatedBy = `${currentUser.firstName} ${currentUser.lastName}`;
      }
      
      notificationSettings.save();

      return res.status(200).json({ message: 'Successfully added notification setting.' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
);

export default router;
