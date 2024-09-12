import mongoose from "mongoose";
import { deleteFilesInDirectory, getFile, saveFile } from "../utils/common";
import AdmZip from "adm-zip";
import express, { Request, Response } from 'express';
import verifyToken, { verifyRole } from '../middleware/auth';

const router = express.Router();

let initiated: Boolean = false;
var collections: any[] = [];
const db = mongoose.connection

// Delay for initiation
const initiate = async () => {
	return await new Promise((resolve, reject) => {
		setTimeout(() => { initiated = true; resolve(true) }, 2000)
	})
}

// Set list of documents
export const listCollection = async () => {
	if (!initiated) await initiate();
	else return collections
	collections = (await db.db.listCollections().toArray()).map((f: any) => f['name']);
}

// Extract documents
export const extractDocuments = async () => {
	if (collections.length === 0) await listCollection()

	// Clear previous files
	deleteFilesInDirectory('/public/backup/archive');

	// Initialize zip
	const zip = new AdmZip();

	// loop collections
	collections.forEach(async (collection) => {
		// get collection by name
		const _tmpCollection = db.collection(collection);
		// get all record from a collection
		const documents = await _tmpCollection.find().toArray();
		// save json file to public dir
		await saveFile('/public/backup/collections', `${collection}.json`, JSON.stringify(documents), true);
	});

	// save zip file to the piblic dir
	const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // Format: YYYYMMDDTHHMMSS
	const zipFilename = `backup_${timestamp}.zip`; // Filename with timestamp
	const pathFile = await saveFile('/public/backup/archive', zipFilename, zip.toBuffer(), true);

	// set the backup folder
	const backupCollectionsFolder = pathFile.replace(`/backup/archive/${zipFilename}`, '/backup/collections');

	// Create zip file
	zip.addLocalFolder(backupCollectionsFolder);
	zip.writeZip(pathFile);
	return {
		pathFile,
		zipFilename
	};
}

// Unzip file
const unzipFile = async (src: string, target: string) => {
	const zip = new AdmZip(src);
	zip.extractAllTo(target, true)
}

// Verify upload
const verifyUpload = async (req: Request) => {
	const { src } = req.body;

	// initialize data
	let srcFormat = { data: "", base64: "" };

	// validate if src exist on body
	if (!src) return { code: 400, message: "Source file is needed and must be in base64 format i.e data:text/plain;base64,abcdef123456789" }

	// extract upload data
	try {
		let tmp = src.split(';');
		srcFormat['data'] = tmp[0].replace('data:', '');
		srcFormat['base64'] = tmp[1].replace('base64,', '');
	} catch (errorProcess) {
		console.log(errorProcess);
		return { code: 500, message: "Source file must be in base64 format i.e data:text/plain;base64,abcdef123456789" }
	}

	// validate file type
	if (!srcFormat['data'].includes('application/zip')) return { code: 400, message: "Attachment should be a zip file" }

	// save file to import folder
	const path = await saveFile('/public/imports/archive', 'backup.zip', srcFormat['base64'], true)

	// extract collections from zip file
	const target = path.replace(`/archive/backup.zip`, '/collections');
	await unzipFile(path, target);

	return { code: 200, message: "success", path: target }
}

/**
 * Routes
 * - export
 * - import
 * - check
 */

router.get('/export', verifyToken, verifyRole("ADMIN"), async (req: Request, res: Response) => {
	try {
		const initiateBackup: any = await extractDocuments()
		const filesrc = await getFile(initiateBackup.pathFile, true)
		if (!filesrc) return res.status(404).json({ message: 'File does not exists anymore' });
		res.status(200)
			.contentType('application/zip')
			.setHeader('Content-Disposition', `attachment; filename=${initiateBackup.zipFilename}`)
			.end(filesrc);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
});

router.patch('/import', verifyToken, verifyRole("ADMIN"), async (req: Request, res: Response) => {
	try {
		const verifyUploadedFile = await verifyUpload(req);

		console.log(verifyUploadedFile)
		if (verifyUploadedFile['code'] !== 200) return res.status(verifyUploadedFile['code']).json(verifyUploadedFile['message'])
		else {
			const collectionList = await listCollection();

			collectionList?.forEach(async (collection) => {
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

					if (fileLength !== backupDocuments.length) backupDocuments = null
				} catch (errorFile) { }

				if (Array.isArray(backupDocuments)) {
					if (backupDocuments.length > 0) {
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

router.patch('/check', verifyToken, async (req: Request, res: Response) => {
	try {
		const verifyUploadedFile = await verifyUpload(req);

		if (verifyUploadedFile['code'] !== 200) return res.status(verifyUploadedFile['code']).json(verifyUploadedFile['message'])
		else {
			const collectionList = await listCollection();
			let noIDs: any[] = [];
			let noRecord: any[] = []
			let errorParsing: any[] = [];
			let currentMoreUpdated: boolean = false;

			collectionList?.forEach(async (collection) => {
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

					if (fileLength !== backupDocuments.length) noIDs.push(collection)

					if (backupDocuments.length === 0) noRecord.push(collection)
				} catch (errorFile) {
					errorParsing.push(collection)
				}

				if (Array.isArray(backupDocuments) && collection === 'assets') {
					if (backupDocuments.length > 0) {
						backupDocuments = backupDocuments.sort((a, b) => b.updated.toString().localCompare(a.updated))

						const _tmpCollection = db.collection(collection);
						let lastupdate: any = await _tmpCollection.aggregate().match({}).sort({ updated: -1 }).limit(1).toArray()

						if (lastupdate.length > 0) {
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