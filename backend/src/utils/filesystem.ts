import path from "path";
import {
  mkdirSync,
  existsSync,
  readFileSync,
  writeFileSync,
  chmodSync,
  readdir,
  stat,
  unlink,
} from "fs";
import { getJSONFromExcelFile } from "./excel";
import { getJSONFromCSVFile } from "./csv";

const directory = path.join(path.resolve(), "../");

/**
 *
 * @param folder
 * @param filename
 * @param src
 * @param fullDirectory if true you provide the complete directory else this function will return the path provided
 * @returns the location of the file on disk
 * @description save a file into specific directory
 */
export const saveFileIntoDir = async (
  folder: string,
  filename: string,
  src: any,
  fullDirectory?: boolean
) => {
  const splitFolder = folder.split("/").filter((f) => {
    return f;
  });
  let tmpFolder = `${directory}`;
  splitFolder.forEach((split) => {
    tmpFolder += `/${split}`;
    if (!existsSync(tmpFolder)) mkdirSync(tmpFolder, 0o777);
  });
  tmpFolder += `/${filename}`;
  if (src instanceof String) writeFileSync(tmpFolder, `${src}`, "base64");
  else writeFileSync(tmpFolder, src);
  chmodSync(tmpFolder, 0o777);
  return fullDirectory
    ? tmpFolder.replace(/\/\//g, "/")
    : tmpFolder.replace(directory, "");
};

/**
 *
 * @param folder
 * @param filename
 * @param base64Data
 * @returns the location of the file on disk
 * @description save file into specific directory from base64 data format
 */
export const saveFileIntoDirFromBase64 = async (
  folder: string,
  filename: string,
  base64Data: any
) => {
  const folderDir = `${directory}${folder}`;
  // Ensure the directory exists
  if (!existsSync(folderDir)) {
    mkdirSync(folderDir, { recursive: true });
  }
  // Decode base64 string and save as ZIP file
  const fileBuffer = Buffer.from(base64Data, "base64");
  const filePath = path.join(folderDir, filename);
  // Save file
  writeFileSync(filePath, fileBuffer);
  return `${folderDir}/${filename}`;
};

/**
 *
 * @param folder
 * @returns the location on disk
 * @description creates the directory file path on disk
 */
export const getDirPath = (folder: string) => {
  return path.join(directory, folder);
};

/**
 *
 * @param filepath the path of the file
 * @param isFullPath if true you provide the complete directory else this function will generate the location
 * @returns the file data in buffer
 * @description gets the data of a file
 */
export const getFileFromDir = async (
  filepath: string,
  isFullPath?: boolean
) => {
  const tmpFolder = isFullPath
    ? filepath
    : `${directory}${filepath}`.replace(/\/\//g, "/");
  try {
    return readFileSync(tmpFolder);
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 * Reads and parses a JSON file from the specified directory and file format.
 * @param directory - The directory where the file is located.
 * @param collection - The name of the collection (used to name the file).
 * @param fileFormat - The file format/extension of the file (e.g., 'json').
 * @returns A promise that resolves to the parsed JSON data.
 */
export const readJSONDataFromJSONFile = async (
  directory: string,
  filename: string
) => {
  try {
    // Construct the file path
    const jsonDir = getDirPath(directory);
    // Get file data
    const fileData: any = await getFileFromDir(`${jsonDir}/${filename}`, true);
    // Parse data
    const jsonData = JSON.parse(fileData.toString());
    return jsonData;
  } catch (error) {
    console.error("Error reading or parsing file:", error);
    throw error;
  }
};

/**
 *
 * @param directory
 * @param filename
 * @returns json data
 * @description return a promise that returns json data
 */
export const readJSONDataFromExcelFile = async (
  directory: string,
  filename: string
) => {
  try {
    const jsonData = await getJSONFromExcelFile(directory, filename);
    return jsonData;
  } catch (error) {
    console.error("Error reading Excel file:", error);
    throw error;
  }
};

/**
 *
 * @param directory
 * @param filename
 * @returns json data
 * @description return a promise that returns json data
 */
export const readJSONDataFromCSVFile = async (
  directory: string,
  filename: string
) => {
  try {
    const jsonData = await getJSONFromCSVFile(directory, filename);
    return jsonData;
  } catch (error) {
    console.error("Error reading Excel file:", error);
    throw error;
  }
};

/**
 *
 * @param folder
 * @returns none
 * @description deletes all the files from specific directory
 */
export const deleteAllFilesInDir = (folder: string): Promise<void> => {
  const folderDir = `${directory}${directory.includes("\\backend") ? "\\.." : ""}${folder}`;
  if (!existsSync(folderDir)) {
    return Promise.reject("Folder does not exist");
  }

  return new Promise((resolve, reject) => {
    // Read folder files
    readdir(folderDir, (err, files) => {
      if (err) {
        reject(`Unable to read directory: ${err}`);
        return;
      }

      // Handle all file deletion in parallel
      const deletePromises = files.map((file) => {
        const filePath = path.join(folderDir, file);

        return new Promise<void>((resolve, reject) => {
          // Check content is a file
          stat(filePath, (err, stats) => {
            if (err) {
              reject(`Unable to get stats for file: ${err}`);
              return;
            }
            // Delete if a file
            if (stats.isFile() && file !== ".gitkeep") {
              unlink(filePath, (err) => {
                if (err) {
                  reject(`Unable to delete file: ${err}`);
                } else {
                  console.log(`Deleted file: ${filePath}`);
                  resolve();
                }
              });
            } else {
              resolve(); // Resolve for directories or non-file entries
            }
          });
        });
      });

      // Wait for all delete promises to complete
      Promise.all(deletePromises)
        .then(() => resolve())
        .catch(reject);
    });
  });
};
