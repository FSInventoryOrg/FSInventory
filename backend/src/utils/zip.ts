import AdmZip from "adm-zip";

export const unzipFile = async (src: string, target: string) => {
	const zip = new AdmZip(src);
	zip.extractAllTo(target, true);
}