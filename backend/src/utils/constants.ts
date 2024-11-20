import { CookieOptions } from "express";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "development",
  maxAge: 86400000,
  path: "/",
  sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
} as CookieOptions;
