import mongoose from "mongoose";
import { saveFile } from "../utils/common";
import AdmZip from "adm-zip";

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

export const listCollection = async () => {
    if (!initiated) await initiate();

    collections = (await db.db.listCollections().toArray()).map((f: any) => f['name']);
}