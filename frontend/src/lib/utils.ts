import { type ClassValue, clsx } from "clsx";
import { parse } from "date-fns";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hexToRgbA(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function isWindowScrollable() {
  const windowHeight = window.innerHeight;
  const bodyScrollHeight = document.body.scrollHeight;
  const documentScrollHeight = document.documentElement.scrollHeight;

  return bodyScrollHeight > windowHeight || documentScrollHeight > windowHeight;
}

const isValidUrl = (url: string, base?: string) => {
  try {
    new URL(url, base);
    return true;
  } catch (err) {
    return false;
  }
};

export function prependHostIfMissing(path?: string) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  if (!API_BASE_URL) return path;
  if (!path) return;

  if (isValidUrl(path)) {
    return path;
  } else {
    return isValidUrl(path, API_BASE_URL)
      ? new URL(path, API_BASE_URL).href
      : undefined;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportToExcel(columns: string[], data: any, fileName: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredData = data.map((row: any) =>
    columns.reduce((accum: Record<string, string>, key: string) => {
      accum[key] = row[key];
      return accum;
    }, {})
  );

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const currentDate = new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  return new Promise<void>((resolve, reject) => {
    try {
      XLSX.writeFile(workbook, `${fileName}-${currentDate}.xlsx`, {
        compression: true,
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export function format(str: string): string {
  return str
    .split(/(?=[A-Z])/)
    .map((part) => part.toLowerCase())
    .join(" ");
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Given a string, returns a Date object. If the string is not parseable or
 * empty, returns a Date object with a value of 0.
 *
 * If the string matches the format MM/dd/yyyy, MM/dd/yy or MM/dd/yyyy, the
 * date is parsed directly from the string. Otherwise, the date is parsed
 * using the `parse` function from the `date-fns` library.
 *
 * @param {string} dateStr - The string to be parsed.
 * @returns {Date} The parsed date.
 */
export const dateNormalizer = (dateStr: string) => {
  if (dateStr.trim() === "" || !dateStr) return new Date(0);
  const dateFormatRegex =
    /^([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|[12][0-9]|3[01])\/(\d{2}|\d{4})$/;
  if (dateFormatRegex.test(dateStr)) {
    const [month, day, year] = dateStr.split("/");

    const fullYear = year.length === 2 ? `20${year}` : year;
    const newDate = parse(
      `${month}/${day}/${fullYear}`,
      "MM/dd/yyyy",
      new Date()
    );
    return newDate;
  }

  const date = new Date(dateStr);
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date;
  }
  return parse(dateStr, "MM/dd/yyyy", new Date());
};

/**
 * Sorts two dates in descending order.
 *
 * If either date is invalid (i.e. NaN), it is considered "later" than the other.
 *
 * @param {Date} dateA - The first date to compare.
 * @param {Date} dateB - The second date to compare.
 * @returns {number} A negative value if dateA is earlier than dateB, a positive value if dateA is later than dateB, or 0 if both dates are equal or invalid.
 */
export const sortDatesDesc = (dateA: Date, dateB: Date): number => {
  // Handle invalid dates
  const isDateAValid = !isNaN(dateA.getTime());
  const isDateBValid = !isNaN(dateB.getTime());

  if (!isDateAValid && !isDateBValid) {
    return 0;
  }
  if (!isDateAValid) {
    return 1;
  }
  if (!isDateBValid) {
    return -1;
  }

  return dateB.getTime() - dateA.getTime();
};
