import * as XLSX from 'xlsx';
import { getDirPath } from "./filesystem";

export const getJSONFromExcelFile = async (directory: string, filename: string) => {
	try {
		// Construct the file path
		const excelDir = getDirPath(directory);
		// Read the Excel file
		const workbook = XLSX.readFile(`${excelDir}/${filename}`);
		// Get the first sheet name
		const sheetName = workbook.SheetNames[0];
		// Get the sheet data
		const sheet = workbook.Sheets[sheetName];
		// Convert sheet data to JSON
		const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // header: 1 for array of arrays
		// Extract headers and rows
		const [headers, ...rows] = jsonData as [string[], ...any[]];
		// Map rows to objects with headers as keys
		return rows.map(row =>
			headers.reduce((acc, header, index) => {
				acc[header] = row[index];
				return acc;
			}, {} as { [key: string]: any })
		);
	} catch (error) {
		console.error('Error reading or parsing file:', error);
		throw error;
	}
}