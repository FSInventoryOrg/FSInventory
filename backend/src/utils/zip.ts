import AdmZip from "adm-zip";

export const unzipFile = (src: string, target: string): Promise<void> => {
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