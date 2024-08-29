import mongoose from "mongoose";
import { getFile, saveFile } from "../utils/common";
import AdmZip from "adm-zip";
import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import verifyToken from '../middleware/auth';

let initiated: Boolean = false;
var collections: any[] = [];
const db = mongoose.connection

const initiate = async() => {
    return await new Promise((resolve, reject) => {
        setTimeout(() => { initiated = true; resolve(true) }, 2000)
    })
}

export const extractDocuments = async () => {
    if(collections.length === 0) await listCollection()
    
    const zip = new AdmZip();
    let filepaths: any[] = []
    collections.forEach(async(collection) => {
        const _tmpCollection = db.collection(collection);
        const documents = await _tmpCollection.aggregate().match({}).toArray();

        const filePath = await saveFile('/public/backup', `${collection}.json`, JSON.stringify(documents), true)

        filepaths.push(filePath)
    })

    const pathFile = await saveFile('/public/attachments', 'backup.zip', zip.toBuffer(), true);
    const backupFolder = pathFile.replace(`/attachments/backup.zip`, '/backup');

    return await new Promise((resolve, _reject) => {
        zip.addLocalFolderAsync(backupFolder, (_success, _error) => {
            zip.writeZip(pathFile);

            resolve(pathFile)

            console.log('Backup has been completed')
        })
    })
}

const unzipFile = async(src: string, target: string) => {
    const zip = new AdmZip(src);

    zip.extractAllTo(target, true)
}

export const listCollection = async () => {
    if (!initiated) await initiate();
    else return collections

    collections = (await db.db.listCollections().toArray()).map((f: any) => f['name']);
}

const verifyUpload = async(req: Request) => {
    const token = req.cookies.auth_token;
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    if (decodedToken.role !== "ADMIN") return { code: 403, message: "Only users with admin role can perform this action" }

    const { src } = req.body;
    let srcFormat = { data: "", base64: "" };

    if (!src) return { code: 400, message: "Source file is needed and must be in base64 format i.e data:text/plain;base64,abcdef123456789" }

    try {
        let tmp = src.split(';');
        srcFormat['data'] = tmp[0].replace('data:', '');
        srcFormat['base64'] = tmp[1].replace('base64,', '');
    } catch (errorProcess) {
        console.log(errorProcess);
        return { code: 500, message: "Source file must be in base64 format i.e data:text/plain;base64,abcdef123456789" }
    }

    if (!srcFormat['data'].includes('application/zip')) return { code: 400, message: "Attachment should be a zip file" }

    const location = `/public/files/imports`;
    const path = await saveFile(location, 'backup.zip', srcFormat['base64'], true)
    const target = path.replace(`/imports/backup.zip`, '/backup');

    await unzipFile(path, target);

    return { code: 200, message: "success", path: target}
}

const router = express.Router();

router.get('/export', verifyToken, async(req: Request, res: Response) => {
    try {
        const token = req.cookies.auth_token;
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

        if (decodedToken.role !== "ADMIN") {
            return res.status(403).json({ message: "Only users with admin role can perform this action" });
        }

        const initiateBackup: any = await extractDocuments()
        const filesrc = await getFile(initiateBackup, true)
        if(!filesrc) return res.status(404).json({ message: 'File does not exists anymore' });

        res.status(200)
            .contentType('application/zip')
            .setHeader('Content-Disposition', `attachment; filename=backup.zip`)
            .end(filesrc);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
      }
});

router.patch('/import', verifyToken, async(req: Request, res: Response) => {
    try {
        const verifyUploadedFile = await verifyUpload(req);

        if(verifyUploadedFile['code'] !== 200) return res.status(verifyUploadedFile['code']).json(verifyUploadedFile['message'])
        else {
            const collectionList = await listCollection();

            collectionList?.forEach(async(collection) => {
                let backupDocuments: any
                try {
                    const bkFile: any = await getFile(`${verifyUploadedFile['path']}/${collection}.json`, true)
                    backupDocuments = JSON.parse(bkFile.toString())
                    
                    const fileLength = backupDocuments.length;
                    backupDocuments = backupDocuments.reduce((accum: any, value: any) => {
                        if (value?._id) {
                            value._id = {
                                '$oid': value._id
                            }

                            accum.push(value)
                        }
                        return accum
                    }, [])

                    if(fileLength !== backupDocuments.length) backupDocuments = null
                } catch (errorFile) {}

                if (Array.isArray(backupDocuments)) {
                    if(backupDocuments.length > 0) {
                        await db.dropCollection(collection);
                        const _tmpCollection = db.collection(collection);
        
                        await _tmpCollection.insertMany(backupDocuments)
                    }
                }
            })
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
      }
});

router.patch('/check', verifyToken, async(req: Request, res: Response) => {
    try {
        const verifyUploadedFile = await verifyUpload(req);

        if(verifyUploadedFile['code'] !== 200) return res.status(verifyUploadedFile['code']).json(verifyUploadedFile['message'])
        else {
            const collectionList = await listCollection();
            let noIDs: any[] = [];
            let noRecord: any[] = []
            let errorParsing: any[] = [];
            let currentMoreUpdated: boolean = false;

            collectionList?.forEach(async(collection) => {
                let backupDocuments: any
                try {
                    const bkFile: any = await getFile(`${verifyUploadedFile['path']}/${collection}.json`, true)
                    backupDocuments = JSON.parse(bkFile.toString())
                    
                    const fileLength = backupDocuments.length;
                    backupDocuments = backupDocuments.reduce((accum: any, value: any) => {
                        if (value?._id) {
                            value._id = {
                                '$oid': value._id
                            }

                            accum.push(value)
                        }
                        return accum
                    }, [])

                    if(fileLength !== backupDocuments.length) noIDs.push(collection)
                    
                    if(backupDocuments.length === 0) noRecord.push(collection)
                } catch (errorFile) {
                    errorParsing.push(collection)
                }

                if (Array.isArray(backupDocuments) && collection === 'assets') {
                    if(backupDocuments.length > 0) {
                        backupDocuments = backupDocuments.sort((a,b) => b.updated.toString().localCompare(a.updated))
                        
                        const _tmpCollection = db.collection(collection);
                        let lastupdate: any = await _tmpCollection.aggregate().match({}).sort({updated: -1}).limit(1).toArray()

                        if(lastupdate.length > 0) {
                            lastupdate = lastupdate[0]

                            const backupLastEntry = new Date(backupDocuments[0].updated)
                            const currentLastEntry = new Date(lastupdate.updated)

                            if (currentLastEntry > backupLastEntry) currentMoreUpdated = true
                        }
                    }
                }
            })

            return res.status(200).json({
                no_id_collection: noIDs,
                no_record_collection: noRecord,
                error_in_parsing: errorParsing,
                currentIsUpdated: currentMoreUpdated
            })
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
      }
});

export default router;