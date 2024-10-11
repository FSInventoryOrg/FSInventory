import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import verifyToken from '../middleware/auth';
import Notification, { NotificationType } from '../models/notification.schema';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const token = req.cookies.auth_token;
        const decodedToken: any = await fetch(`${process.env.ROCKS_DEV_API_URL}/auth/token`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
        });
        
        const notifications: any = await Notification.aggregate().match({
            $expr: {
                $and: [
                    { $in: [decodedToken.userId, '$target_users']}
                ]
            }
        }).sort({
            updated: -1
        });

        let newData = notifications.reduce((accum: NotificationType[], value: NotificationType, index: number) => {
            let singleData: any = {
                _id: value['_id'].toString(),
                message: value['message'],
                message_html: value['message_html'],
                openTab: value['openTab'],
                url: value['url'],
                date: value['updated'],
                read: value['seen_users'].includes(decodedToken.userId)
            };


            accum.push(singleData);
            return accum;
        }, []);

        let notifDetails = {
            unread: newData.filter((f: any)=> !f['read']).length,
            count: newData.length,
            data: newData
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
        const decodedToken: any = await fetch(`${process.env.ROCKS_DEV_API_URL}/auth/token`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
        });
        
        const requestBody = req.body;

        if (!Array.isArray(requestBody)) return res.status(422).json({ message: 'Payload should be arrays of _ids' });
        
        let mongoIDs = requestBody.reduce((accum, value: string, index) => {
            let valueID = new mongoose.Types.ObjectId(value);
            accum.push(valueID);
            return accum;
        }, []);

        const notifications: any = await Notification.aggregate().match({
            $expr: {
                $and: [
                    { $in: [decodedToken.userId, '$target_users']},
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