import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

const isValidUrl = (url:string, base?: string)=> {
  try {
    new URL(url, base);
    return true;
  } catch (err) {

    return false;
  }
}

export function prependHostIfMissing(path?: string) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  if (!API_BASE_URL) return path;
  if (!path) return;

  if (isValidUrl(path)) {
    return path
  } else {
   return isValidUrl(path, API_BASE_URL)? new URL(path, API_BASE_URL).href : undefined
  }
}
