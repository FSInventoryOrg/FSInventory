/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, NextFunction } from "express";

export interface UserAuth {
  userId: number;
  role: string;
  email: string;
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
  data: {
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
const TOKEN_EXPIRED: string = "Token expired";
const UNAUTHORIZED_ACCESS: string = "Unauthorized access";
const ADMIN_ERROR: string =
  "Only users with admin role can perform this action";
const { IT_MANAGER } = process.env;

const API_URL: string =
  NODE_ENV === "PRODUCTION" ? ROCKS_PRODUCTION_API_URL! : ROCKS_DEV_API_URL!;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res.status(401).json({ message: UNAUTHORIZED_ACCESS });
  }
  try {
    const user: RocksUser = await (
      await fetch(`${API_URL}/users/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
    ).json();
    const { id: userId, role, email } = user.data;
    req.user = {
      userId,
      role,
      email,
    } as UserAuth;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: UNAUTHORIZED_ACCESS });
  }
};

const verifyRole = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED_ACCESS });
  }
  const { email } = req.user;
  if (email !== IT_MANAGER) {
    return res.status(403).json({ message: ADMIN_ERROR });
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

  if (!status.ok) throw Error(TOKEN_EXPIRED);

  return status;
};

const tokenUser = async (token: string) => {
  const status = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!status.ok) throw Error(TOKEN_EXPIRED);

  return status;
};

export default verifyToken;
export { verifyRole, tokenStatus, tokenUser, ADMIN, IT_MANAGER };
