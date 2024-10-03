import { Request } from 'express';
interface UploadRequestBody {
	src?: string;
}

export const extractUploadData = async (req: Request, expectedFileType: string) => {
	// Get src data
	const { src } = req.body as UploadRequestBody;
	// Validate
	if (!src) return { status: 400, message: "Source file is needed and must be in base64 format i.e data:text/plain;base64,abcdef123456789" }
	// initialize data
	let srcFormat = { data: "", base64: "" };
	try {
		// Process the src to separate data and base64
		let tmp = src.split(';');
		srcFormat['data'] = tmp[0].replace('data:', '');
		srcFormat['base64'] = tmp[1].replace('base64,', '');
	} catch (errorProcess) {
		return { status: 500, message: "Source file must be in base64 format i.e data:text/plain;base64,abcdef123456789" }
	}
	// Validate file type
	if (!srcFormat.data.includes(expectedFileType)) return { status: 400, message: "Attachment should be a zip file" }
	return { status: 200, message: "Processing successful", data: srcFormat };
}