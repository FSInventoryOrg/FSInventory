import mongoose from "mongoose";
import { deleteFilesInDirectory, getFile, getFilePath, saveFile, saveFileFromBase64 } from "../utils/common";
const { ObjectId } = require('mongodb');
import AdmZip from "adm-zip";
import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator'
import verifyToken, { verifyRole } from '../middleware/auth';

// File
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from "path";

const router = express.Router();

let initiated: Boolean = false;
var collections: any[] = [];
const db = mongoose.connection


// Set list of documents
export const listCollection = async () => {
	return (await db.db.listCollections().toArray()).map((f: any) => f['name']);
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

// Convert text id to MongoDB Object Id
const convertIdToObjectId = (doc: any) => {
	if (doc._id && typeof doc._id === 'string') {
		doc._id = new ObjectId(doc._id);
	}
	return doc;
};


/**
 * Export system data into zip file
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

/**
 * Verify the backup data to be uploaded then save it on disk
 */
router.post('/verify', verifyToken, verifyRole("ADMIN"), async (req: Request, res: Response) => {
	// Verify and upload file to the import directory
	const { src } = req.body;
	// validate if src exist on body
	if (!src) return { code: 400, message: "Source file is needed and must be in base64 format i.e data:text/plain;base64,abcdef123456789" }
	// initialize data
	let srcFormat = { data: "", base64: "" };
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
	// Save file
	const backupDir = await saveFileFromBase64('/public/import/archive', 'backup.zip', srcFormat['base64']);
	// Extract directory
	const extractDir = backupDir.replace("/archive/backup.zip", "/collections");
	// extract collections from zip file
	await unzipFile(backupDir, extractDir);
	// Response
	res.status(200).json({ message: "No collections found" });
});

/**
 * Import into database the verified file
 */
router.post('/import', verifyToken, verifyRole("ADMIN"),
	async (req: Request, res: Response) => {
		try {
			// Get import filepath
			const verifiedUploadedDir = getFilePath("/public/backup/collections");
			// Get list of collection name
			const collectionList = await listCollection();
			if (!collectionList || collectionList.length === 0) {
				return res.status(404).json({ message: "No collections found" });
			}
			// Loop collection
			for (const collection of collectionList) {
				try {
					const bkFile: any = await getFile(`${verifiedUploadedDir}/${collection}.json`, true)
					const jsonData = JSON.parse(bkFile.toString());
					const deserializedData = jsonData.map(convertIdToObjectId);
					// Check if there is any data to import
					if (deserializedData.length === 0) {
						console.warn(`No data to import for collection ${collection}`);
						continue;
					}
					// Delete then insert data
					await db.collection(collection).deleteMany({});
					await db.collection(collection).insertMany(deserializedData);
				} catch (errorFile) {
					console.error(`Error processing file for collection ${collection}:`, errorFile);
				}
			}
			res.status(200).json({ message: "Success" });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: "Something went wrong" });
		}
	});

router.patch('/check', verifyToken, async (req: Request, res: Response) => {
	try {
		// Get import filepath
		const verifiedUploadedDir = getFilePath("/public/backup/collections");

		const collectionList = await listCollection();
		let noIDs: any[] = [];
		let noRecord: any[] = []
		let errorParsing: any[] = [];
		let currentMoreUpdated: boolean = false;

		collectionList?.forEach(async (collection) => {
			let backupDocuments: any
			try {
				const bkFile: any = await getFile(`${verifiedUploadedDir}/${collection}.json`, true)
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
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
});

export default router;