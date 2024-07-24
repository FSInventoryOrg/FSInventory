import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import verifyToken from '../middleware/auth';
import Notification from '../models/notification.schema';
import mongoose from 'mongoose';
import mongodb from 'mongodb';

const router = express.Router();

router.get('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const token = req.cookies.auth_token;
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        
        const notifications: any = await Notification.aggregate().match({
            $expr: {
                $and: [
                    { $in: ['$target_users', [decodedToken.userId]]}
                ]
            }
        }).sort({
            updated: -1
        }).limit(50);

        let notifDetails = {
            unread: notifications.filter((f: any)=> !f.seen_users.includes(decodedToken.userId)).length,
            data: notifications
        }

        return res.status(200).json(notifDetails);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

router.patch('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const token = req.cookies.auth_token;
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        
        const requestBody = req.body;

        if (!Array.isArray(requestBody)) return res.status(422).json({ message: 'Payload should be arrays of _ids' });
        
        let mongoIDs = requestBody.reduce((accum, value, index) => {
            let valueID = new mongodb.ObjectId(value);
            accum.push(valueID);
            return accum;
        }, []);

        const notifications: any = await Notification.aggregate().match({
            $expr: {
                $and: [
                    { $in: ['$target_users', [decodedToken.userId]]},
                    { $in: ['$_id', mongoIDs]}
                ]
            }
        });

        notifications.forEach(async(notif: any) => {
            notif['seen_users'].push(decodedToken.userId);
            notif['seen_users'] = notif['seen_users'].filter((value: string, index: number, array: any) => { return array.indexOf(value) === index });

            await Notification.updateOne({_id: notif['_id']}, { seen_users: notif['seen_users']})
        })

        return res.status(200).json({ message: "Successfully patched" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;