import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import verifyToken from '../middleware/auth';
import { tokenStatus } from '../utils/rocks';
import Notification, { NotificationType } from '../models/notification.schema';
import mongoose from 'mongoose';

const router = express.Router();

// NOTIFICATIONS WILL NOT WORK FOR THE FIRST ROLLOUT OF ROCKS AUTH API

router.get('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const {auth_token: token, user} = req.cookies;
        await tokenStatus(token)

        const currentUser = JSON.parse(user);

        const notifications: any = await Notification.aggregate().match({
            $expr: {
                $and: [
                    { $in: [currentUser.user_id, '$target_users'] }
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
                read: value['seen_users'].includes(currentUser.user_id)
            };


            accum.push(singleData);
            return accum;
        }, []);

        let notifDetails = {
            unread: newData.filter((f: any) => !f['read']).length,
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
        const {auth_token: token, user} = req.cookies;
        await tokenStatus(token)

        const currentUser = JSON.parse(user);
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
                    { $in: [currentUser.user_id, '$target_users'] },
                    { $in: ['$_id', mongoIDs] }
                ]
            }
        });

        notifications.forEach(async (notif: any) => {
            notif['seen_users'].push(currentUser.user_id);
            notif['seen_users'] = notif['seen_users'].filter((value: string, index: number, array: any) => { return array.indexOf(value) === index });

            await Notification.updateOne({ _id: notif['_id'] }, { seen_users: notif['seen_users'] })
        })

        return res.status(200).json({ message: "Successfully patched" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;