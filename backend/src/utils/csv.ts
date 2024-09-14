import * as fs from 'fs';
import { parse } from 'csv-parse';
import { getDirPath } from './filesystem';

export const getJSONFromCSVFile = async (directory: string, filename: string) => {
	return new Promise((resolve, reject) => {
		const results: any[] = [];

		// Construct the file path
		const csvDir = getDirPath(directory);

		// Read the CSV file stream
		fs.createReadStream(`${csvDir}/${filename}`)
			.pipe(parse({
				delimiter: ',',
				columns: (header) => header.map((h: any) => h.replace(/^\ufeff/, '')), // Remove BOM from headers
				trim: true,     // Trim whitespace
				skip_empty_lines: true // Skip empty lines
			}))
			.on('data', (row) => {
				// Remove BOM from values if necessary
				for (const key of Object.keys(row)) {
					row[key] = row[key].replace(/^\ufeff/, '');
				}
				results.push(row);
			})
			.on('end', () => resolve(results))
			.on('error', (error) => {
				console.error('Error reading CSV file:', error);
				reject(error);
			});
	});
}