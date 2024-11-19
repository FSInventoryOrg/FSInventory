/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, NextFunction } from "express";

export interface UserAuth {
  userId: number;
  role: string;
}

type RocksRoles =
  | "superadmin"
  | "admin"
  | "standarduser"
  | "client"
  | "hr"
  | "floormanager"
  | "finance"
  | "sales"
  | "contentwriter";

export interface RocksUser {
  id: number;
  employee_id: number;
  name: string;
  email: string;
  user_name: string;
  role: RocksRoles;
  role_is_active: number;
  can_login: number;
  is_verified: number;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  clients: null;
  deleted_at: string | null;
  roles: {
    data: [
      {
        id: number;
        is_enabled: number;
        role_id: number;
        user_id: number;
      },
    ];
  };
}

/* Extend Request type and add userId */
declare global {
  namespace Express {
    interface Request {
      user: UserAuth;
    }
  }
}

const { ROCKS_DEV_API_URL, ROCKS_PRODUCTION_API_URL, NODE_ENV } = process.env;

const API_URL: string = NODE_ENV
  ? ROCKS_PRODUCTION_API_URL!
  : ROCKS_DEV_API_URL!;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  try {
    const user: RocksUser = await (await fetch(`${API_URL}/users/me`)).json();
    req.user = {
      userId: user.id,
      role: user.role, // TEMPORARY FIX UNTIL ROCKS API RETURNS ROLES
    } as UserAuth;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

const verifyRole =
  (requiredRole: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const { role } = req.user;
    if (role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };

const tokenStatus = async (token: string) => {
  const status = await fetch(`${API_URL}/auth/check`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!status.ok) throw Error("Token expired");

  return status;
};

export default verifyToken;
export { verifyRole, tokenStatus };
