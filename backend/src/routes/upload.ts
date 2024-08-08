import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import verifyToken from '../middleware/auth';
import User from '../models/user.schema';
import mongoose from 'mongoose';
import { saveFile } from '../utils/common';
import Attachment from '../models/attachments';

const router = express.Router();

const processUpload = async (req: Request, res: Response, folder: string) => {
    try {
        const token = req.cookies.auth_token;
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        const currentUser: any = await User.findOne({ _id: decodedToken.userId });

        const {src, filename } = req.body;
        let srcFormat = { data: "", base64: ""};
    
        if(!src) return res.status(400).json({ message: "Source file is needed and must be in base64 format i.e data:text/plain;base64,abcdef123456789" });
        if(!filename) return res.status(400).json({ message: "Original filename is needed" });
        
        try{
            let tmp = src.split(';');
            srcFormat['data'] = tmp[0].replace('data:', '');
            srcFormat['base64'] = tmp[1].replace('base64,', '');
        } catch(errorProcess) {
            console.log(errorProcess);
            return res.status(500).json({ message: "Source file must be in base64 format i.e data:text/plain;base64,abcdef123456789" });
        }

        const newId = new mongoose.Types.ObjectId();
        const location = `/public/files/${folder}`;
        const downlink = `/api/download/file/${newId.toString()}`;
        const infolink = `/api/download/info/${newId.toString()}`;
        const path = await saveFile(location, newId.toString(), srcFormat['base64'])

        const fileData = {
            _id: newId,
            created: new Date(),
            updated: new Date(),
            createdBy: `${currentUser['firstName']} ${currentUser['lastName']}`,
            updatedBy: `${currentUser['firstName']} ${currentUser['lastName']}`,
            downloadLink: downlink,
            infoLink: infolink,
            path: path,
            size: srcFormat['base64'].length,
            originalName: filename,
            filetype: srcFormat['data']
        }

        const attachment = new Attachment(fileData);
        await attachment.save();

        return res.status(200).json(attachment);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
      }
}

router.post('/user', verifyToken, async(req: Request, res: Response) => { await processUpload(req, res, 'user') });
router.post('/request', verifyToken, async(req: Request, res: Response) => { await processUpload(req, res, 'request') });
router.post('/asset', verifyToken, async(req: Request, res: Response) => { await processUpload(req, res, 'asset') });

export default router;