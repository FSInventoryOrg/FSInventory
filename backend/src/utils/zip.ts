import AdmZip from "adm-zip";

/**
 * 
 * @param src the location of the zip file on disk
 * @param target the path to extract the file
 * @returns none
 * @description this extracts zip file from path1 to path2
 */
export const unzipFileToDir = (src: string, target: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		try {
			const zip = new AdmZip(src);
			zip.extractAllTo(target, true);
			resolve();
		} catch (error) {
			reject(`Error extracting ZIP file: ${error}`);
		}
	});
};