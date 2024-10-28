import * as XLSX from 'xlsx';
import { getDirPath } from "./filesystem";
import { isDate, isEqual, parse } from 'date-fns';
import Employee from '../models/employee.schema';

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

export interface ExcelHardware {
  type: string;
  code: string;
  brand: string;
  modelName: string;
  modelNo: string;
  serialNo: string;
  category: string;
  status: string;
  remarks: string;
  deploymentDate: Date;
  recoveredFrom: string;
  recoveryDate: Date;
  assignee: string;
  purchaseDate: Date;
  processor: string;
  memory: string;
  storage: string;
  supplierVendor: string;
  pezaForm8105: string;
  pezaForm8106: string;
  isRGE: boolean;
  equipmentType: string;
}

function normalizeDate(dateStr: any) {
  if (dateStr && typeof dateStr === "string") {
    dateStr = dateStr.trim();
    let d = parse(dateStr, "M/d/yyyy", new Date());
    if (!d.valueOf()) {
      d = parse(dateStr, "MM/d/yyyy", new Date());
    }
    if (!d.valueOf()) {
      d = parse(dateStr, "MM/dd/yyyy", new Date());
    }
    return d;
  } else {
    return dateStr;
  }
}

async function findEmployee(
  name: string
): Promise<string> {
  if(!name){
    return ''
  }
  
  const employee = await Employee.findOne({ $text: { $search: name } });
  // if we could not find the employee, just use the value inside excel
  if (employee === null) {
    return '';
  }
  return employee.code;
}

async function parseHardwareSheet(
  hardwareSheet: XLSX.WorkSheet
): Promise<ExcelHardware[]> {
  return Promise.all(
    XLSX.utils
      .sheet_to_json(hardwareSheet, { raw: false })
      .map(async (rowJson: any) => {
        return {
          type: "Hardware",
          code: rowJson[" "],
          brand: rowJson["Brand"],
          modelName: rowJson["Model Name"],
          modelNo: rowJson["Model Number"],
          serialNo: rowJson["Serial Number"],
          category: rowJson["-"],
          status: rowJson[" _1"],
          remarks: rowJson["Remarks"],
          deploymentDate: normalizeDate(rowJson["Deployed Date"]),
          recoveredFrom: await findEmployee(rowJson["Recovered From"]),
          recoveryDate: normalizeDate(rowJson["Recovered Date"]),
          assignee: await findEmployee(rowJson["Assigned To"]),
          purchaseDate: normalizeDate(rowJson["Purchase Date"]),
          processor: rowJson["Processor"],
          memory: rowJson["Memory"],
          storage: rowJson["Hard Drive"],
          supplierVendor: rowJson["Supplier/Vendor"],
          pezaForm8105: rowJson["PEZA Form 8105"],
          pezaForm8106: rowJson["8106"],
          isRGE: rowJson["Is RGE"] && rowJson["Is RGE"].toUpperCase() === "YES",
          equipmentType: rowJson["Equipment Type"],
          // client: rowJson["Client/Project"], no client field in `assets`
        };
      })
  );
}

export async function extractAssetData(
  workbook: XLSX.WorkBook
): Promise<ExcelHardware[]> {
  let assets: ExcelHardware[] = [];

  assets = assets.concat(await parseHardwareSheet(workbook.Sheets["Hardware"]));
  // TODO
  // add more here to parse other sheets

  return assets;
}

/**
 * Checks to see if value was not defined, that is, `undefined`, `null`, or empty string
 *
 * @param value
 * @returns boolean
 */
function notDefined(value: any) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  );
}

export function listChanges(mongoData: any, excelData: any) {
  return Object.keys(excelData)
    .map((key) => {
      // if both values are 'not defined', then they are considered equal
      if (notDefined(mongoData[key]) && notDefined(excelData[key])) {
        // compare dates
      } else if (isDate(excelData[key]) || isDate(mongoData[key])) {
        return isEqual(
          normalizeDate(mongoData[key]),
          normalizeDate(excelData[key])
        )
          ? undefined
          : [key, excelData[key]];
      } else if (excelData[key] !== mongoData[key]) {
        console.log(
          `${mongoData.code}:${key} - ${excelData[key]} != ${mongoData[key]}`
        );
        return [key, excelData[key]];
      }
    })
    .filter((entry) => entry);
}

export function applyChanges(mongoData: any, changes: any) {
  const copy = Object.assign({}, mongoData);
  changes.forEach((entry: any) => {
    copy[entry[0]] = entry[1];
  });
  return copy;
}
