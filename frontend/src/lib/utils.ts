import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as XLSX from 'xlsx';

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
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
    Object.keys(row).reduce((accum: Record<string, string>, key: string) => {
      if (columns.includes(key)) {
        accum[key] = row[key];
      }
      return accum;
    }, {})
  );

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const currentDate = new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${fileName}-${currentDate}.xlsx`, {
    compression: true,
  });
}