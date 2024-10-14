import mongoose from "mongoose";
import AdmZip from "adm-zip";
import xlsx from 'xlsx';
import express, { Request, Response } from 'express';
import { getUploadFormat } from "../utils/common";
import verifyToken, { verifyRole } from '../middleware/auth';
import { extractUploadData } from "../utils/upload";
import { unzipFileToDir } from "../utils/zip";
import { convertIdToObjectId, convertObjectIdToId, formatDate, stringifyNestedFields } from "../utils/document";
import { deleteAllFilesInDir, getDirPath, getFileFromDir, readJSONDataFromCSVFile, readJSONDataFromExcelFile, readJSONDataFromJSONFile, saveFileIntoDir, saveFileIntoDirFromBase64 } from "../utils/filesystem";
import logger from "../utils/logger";
import { applyChanges, ExcelHardware, extractAssetData, listChanges } from "../utils/excel";
import Asset, { AssetType } from "../models/asset.schema";

const db = mongoose.connection;
const router = express.Router();

// Get the list of documents
export const listCollection = async () => {
	const collectionList = await db.db.listCollections().toArray();
	return collectionList.map((f: any) => f['name']);
}

// Extract documents
export const extractDocuments = async (fileFormat: string = "json") => {
	// Validate file format
	if (!['json', 'excel', 'csv'].includes(fileFormat)) return { status: 500, };
	// Get list of collections
	const collections = await listCollection();
	if (collections.length === 0) return { status: 404, };
	// Clear previous files
	await deleteAllFilesInDir('/public/backup/archive');
	// Initialize zip
	const zip = new AdmZip();
	// Directories
	const collectionsDir = `/public/backup/${fileFormat}`;
	const archiveDir = '/public/backup/archive';
	// Create a list of promises for file saving
	for (const collection of collections) {
		// get all record from a collection
		const documents = await db.collection(collection).find().toArray();
		if (fileFormat === 'json') {
			// save json file to public dir
			await saveFileIntoDir(collectionsDir, `${collection}.json`, JSON.stringify(documents), true);
		} else {
			// Sanitize documents to handle _id
			const sanitizedDocuments = documents.map(doc => convertObjectIdToId(doc));
			// Stringify nested fields
			const stringifiedDocuments = sanitizedDocuments.map(doc => stringifyNestedFields(doc));
			// Format dates
			const formattedDocuments = stringifiedDocuments.map(doc => formatDate(doc, ['updated']));
			// Create excel or csv
			const wb = xlsx.utils.book_new();
			const ws = xlsx.utils.json_to_sheet(formattedDocuments);
			xlsx.utils.book_append_sheet(wb, ws, collection);
			const buffer = xlsx.write(wb, { bookType: fileFormat === 'csv' ? 'csv' : 'xlsx', type: 'buffer' });
			await saveFileIntoDir(collectionsDir, `${collection}.${fileFormat === 'csv' ? 'csv' : 'xlsx'}`, buffer, true);
		}
	}
	// save zip file to the piblic dir
	const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // Format: YYYYMMDDTHHMMSS
	const zipFilename = `backup_${timestamp}.zip`; // Filename with timestamp
	const pathFile = await saveFileIntoDir(archiveDir, zipFilename, zip.toBuffer(), true);
	// set the backup folder
	const backupCollectionsFolder = getDirPath(`/public/backup/${fileFormat}`);
	// Create zip file
	zip.addLocalFolder(backupCollectionsFolder);
	zip.writeZip(pathFile);
	return {
		status: 200,
		pathFile,
		zipFilename
	};
}

/**
 * Export system data into zip file
 */
router.get('/export', verifyToken, verifyRole("ADMIN"), async (req: Request, res: Response) => {
	try {
		const { fileFormat } = req.query as { fileFormat: string };
		const initiateBackup: any = await extractDocuments(fileFormat);
		if (initiateBackup['status'] == 404) return res.status(404).json({ message: 'No collections found' });
		if (initiateBackup['status'] == 500) return res.status(500).json({ message: 'Invalid file format' });
		const filesrc = await getFileFromDir(initiateBackup.pathFile, true)
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
router.post('/validate', verifyToken, verifyRole("ADMIN"), async (req: Request, res: Response) => {
	try {
		const uploadData = await extractUploadData(req, 'application/zip');
		if (uploadData.status !== 200) return { status: uploadData.status, message: uploadData.message };
		let srcFormat = uploadData.data;
		// EXTRACTION PROCESS
		// delete previous extracts
		await deleteAllFilesInDir('/public/import/collections');
		// save file
		const backupDir = await saveFileIntoDirFromBase64('/public/import/archive', 'backup.zip', srcFormat?.base64);
		// extract collections from zip file
		const extractDir = getDirPath("/public/import/collections");
		await unzipFileToDir(backupDir, extractDir);

		const fileFormat = getUploadFormat('/public/import/collections')?.split('.')[1];
		if(!fileFormat){
			res.status(400).json({ message: "invalid file format" });
		}

		// VALIDATION PROCESS
		let staleCollections: { [key: string]: { current: any[], backup: any[] } } = {};
		let hasStale = false;
		// Get list of collection name
		const collectionList = await listCollection();
		if (!collectionList || collectionList.length === 0) return res.status(404).json({ message: "No collections found" });
		// Loop collection
		for (const collection of collectionList) {
			// Get collection documents
			const collectionDocuments = await db.collection(collection).find().toArray();
			try {
				let backupJsonData;
				if (fileFormat === 'json') {
					backupJsonData = await readJSONDataFromJSONFile('/public/import/collections', `${collection}.${fileFormat}`);
				} else if (fileFormat === 'xlsx') {
					backupJsonData = await readJSONDataFromExcelFile('/public/import/collections', `${collection}.${fileFormat}`);
				} else {
					backupJsonData = await readJSONDataFromCSVFile('/public/import/collections', `${collection}.${fileFormat}`);
				}
				if (!backupJsonData) continue;
				const backupDeserializedData = backupJsonData.map(convertIdToObjectId);
				// Create a map of backup data for quick lookup
				const backupDataMap = new Map<string, any>(backupDeserializedData.map((doc: any) => [doc._id.toString(), doc]));
				// Arrays to hold stale documents
				const currentStaleDocs: any[] = [];
				const backupStaleDocs: any[] = [];
				// Check if there is any data to import
				if (backupDeserializedData.length === 0) continue;
				// Check for stale records
				for (const doc of collectionDocuments) {
					const backupDoc = backupDataMap.get(doc._id.toString());
					if (backupDoc) {
						// Check if updated exists and is greater
						const dbUpdatedAt = doc.updated ? new Date(doc.updated) : null;
						const backupUpdatedAt = backupDoc.updated ? new Date(backupDoc.updated) : null;
						// Check if the document is stale
						if (dbUpdatedAt && backupUpdatedAt && dbUpdatedAt > backupUpdatedAt) {
							currentStaleDocs.push(doc);
							backupStaleDocs.push(backupDoc);
							hasStale = true;
						} else if (!dbUpdatedAt && backupUpdatedAt) {
							// Fallback to created if updated is missing
							const dbCreatedAt = doc.created ? new Date(doc.created) : null;
							const backupCreatedAt = backupDoc.created ? new Date(backupDoc.created) : null;
							// Check by created at
							if (dbCreatedAt && backupCreatedAt && dbCreatedAt > backupCreatedAt) {
								currentStaleDocs.push(doc);
								backupStaleDocs.push(backupDoc);
								hasStale = true;
							}
						}
					} else {
						// Document in the database is not present in backup
						currentStaleDocs.push(doc);
					}
				}
				// If there are stale documents, add them to the result
				if (currentStaleDocs.length > 0 || backupStaleDocs.length > 0) {
					staleCollections[collection] = {
						current: currentStaleDocs,
						backup: backupStaleDocs
					};
				}
				// Validate each record
			} catch (errorFile) {
				console.error(`Error processing file for collection ${collection}:`, errorFile);
			}
		}
		// Response
		if (Object.keys(staleCollections).length > 0) {
			res.status(200).json({
				message: "oudated record found on the backup file",
				outdated: hasStale,
				values: staleCollections,
			});
		} else {
			res.status(200).json({ message: "no outdated record" });
		}
	} catch (err) {
		res.status(500).json({ message: "something went wrong" });
	}
});

/**
 * Verify the backup data to be uploaded then save it on disk
 * 
 */
router.post('/validate_excel', verifyToken, verifyRole("ADMIN"), async (req: Request, res: Response) => {
	try{
		const { status, data} = await extractUploadData(req, 'application/vnd.openxmlformat');
		if(status != 200){
			return res.status(status).json({ message: "something went wrong with parsing upload data" })
		}
		if(!data?.base64){
			return res.status(400).json({ message: "data not found" })
		}

		let staleCollections: { [key: string]: { current: AssetType[], backup: ExcelHardware[] } } = {};

		// Parse directly, don't write to file, only to read it again
		const fileBuffer = Buffer.from(data.base64, 'base64');
		const excelAssets = await extractAssetData(xlsx.read(fileBuffer))

		// Check if there is any data to import
		if (!excelAssets || excelAssets.length === 0) return;

		// Create document cache for fast lookup
		const assetDataMap = new Map<string, ExcelHardware>(excelAssets.map((asset: ExcelHardware) => [asset.code, asset]));

		// Load all the assets into memory. THIS MIGHT BE A PROBLEM IN THE FUTURE if the asset collection gets too large! 
		const mongoAssets = await Asset.find().lean(true);
		
		const changedMongoData: any[] = [];
		const changedExcelData: any[] = [];
		// Check for changes
		for (const mongoAsset of mongoAssets) {
			// use the code to find the excel asset
			const excelAsset = assetDataMap.get(mongoAsset.code);
			if (excelAsset) {
				const changes = listChanges(mongoAsset, excelAsset) || []
				changedExcelData.push(applyChanges(mongoAsset, changes))
				changedMongoData.push(mongoAsset);
			} else {
				// Document in the database is not present in backup
				changedMongoData.push(mongoAsset);
			}
		}
		// Add them to the result
		if (changedMongoData.length > 0 || changedExcelData.length > 0) {
			staleCollections["assets"] = {
				current: changedMongoData,
				backup: changedExcelData
			};

			res.status(200).json({
				message: "oudated record found on the backup file",
				outdated: false,
				values: staleCollections,
			});
			
		}else{
			res.status(200).json({ message: "no outdated record" });
		}
	}catch(err){
		console.error(err)
		res.status(500).json({ message: "something went wrong" })
	}

})

/**
 * Import into database the verified file
 */
router.post('/import', verifyToken, verifyRole("ADMIN"),
	async (req: Request, res: Response) => {
		try {
			// Get list of collection name
			const collectionList = await listCollection();
			if (!collectionList || collectionList.length === 0) {
				return res.status(404).json({ message: "No collections found" });
			}
			// Get file format
			const fileFormat = getUploadFormat('/public/import/collections')?.split('.')[1];
            if(!fileFormat){
                res.status(400).json({ message: "invalid file format" });
            }
			// Loop collection
			for (const collection of collectionList) {
				try {
					let importJsonData;
					if (fileFormat === 'json') {
						importJsonData = await readJSONDataFromJSONFile('/public/import/collections', `${collection}.${fileFormat}`);
					} else if (fileFormat === 'xlsx') {
						importJsonData = await readJSONDataFromExcelFile('/public/import/collections', `${collection}.${fileFormat}`);
					} else {
						importJsonData = await readJSONDataFromCSVFile('/public/import/collections', `${collection}.${fileFormat}`);
					}
					if (!importJsonData) continue;
					let importDeserializedData = importJsonData.map(convertIdToObjectId);
					// Loop selected backup data
					if (req.body[collection]) {
						for (const bkpData of req.body[collection]) {
							const bkpConvertedData = convertIdToObjectId(bkpData);
							const bkpIndex = importDeserializedData.findIndex((bkpItem: any) => bkpItem._id.equals(bkpConvertedData._id));
							if (bkpIndex !== -1) {
								importDeserializedData[bkpIndex] = bkpConvertedData;
							}
						}
					}
					// Check if there is any data to import
					if (importDeserializedData.length === 0) {
						continue;
					}
					// Delete then insert data
					await db.collection(collection).deleteMany({});
					await db.collection(collection).insertMany(importDeserializedData);
				} catch (errorFile) {
					console.error(`Error processing file for collection ${collection}:`, errorFile);
				}
			}
			res.status(200).json({ message: "Success" });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: "Something went wrong" });
		}
	},
);


/**
 * IGNORE THIS PART
 */
router.patch('/check', verifyToken, async (req: Request, res: Response) => {
	try {
		// Get import filepath
		const verifiedUploadedDir = getDirPath("/public/backup/collections");

		const collectionList = await listCollection();
		let noIDs: any[] = [];
		let noRecord: any[] = []
		let errorParsing: any[] = [];
		let currentMoreUpdated: boolean = false;

		collectionList?.forEach(async (collection) => {
			let backupDocuments: any
			try {
				const bkFile: any = await getFileFromDir(`${verifiedUploadedDir}/${collection}.json`, true)
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

/**
 * Clear tables
 */
router.delete('/clear', verifyToken, verifyRole("ADMIN"),
	async (req: Request, res: Response) => {
		try {
			// Get list of collection name
			const collectionList = await listCollection();
			if (!collectionList || collectionList.length === 0) {
				return res.status(404).json({ message: "No collections found" });
			}
			// Loop collection
			for (const collection of collectionList) {
				try {
					// Delete all records
					await db.collection(collection).deleteMany({});
				} catch (errorFile) {
					console.error(`Error processing file for collection ${collection}:`, errorFile);
				}
			}
			res.status(200).json({ message: "Success" });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: "Something went wrong" });
		}
	}
);

export default router;