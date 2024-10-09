import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

export interface UserAuth {
	userId: number;
	role: string;
}

export interface RocksUser {
	id: number,
	employee_id: number,
	name: string,
	email: string,
	user_name: string,
	role: string,
	role_is_active: number,
	can_login: number,
	is_verified: number,
	created_at: string,
	updated_at: string,
	updated_by: string | null,
	clients: null,
	deleted_at: string | null,
	roles: {
		data: [
			{
				id: number,
				is_enabled: number,
				role_id: number,
				user_id: number
			}
		]
	}
}

/* Extend Request type and add userId */
declare global {
	namespace Express {
		interface Request {
			user: UserAuth;
		}
	}
}

const { ROCKS_DEV_API_URL } = process.env

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies["auth_token"];
	if (!token) {
		return res.status(401).json({ message: "Unauthorized access" })
	}
	try {
		const user: RocksUser = await (await fetch(`${ROCKS_DEV_API_URL}/users/me`)).json();
		req.user = {
			userId: user.id,
			role: "ADMIN", // TEMPORARY FIX UNTIL ROCKS API RETURNS ROLES
		} as UserAuth;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Unauthorized access" })
	}
}

const verifyRole = (requiredRole: string) => (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized access" });
	}
	const { role } = req.user;
	if (role !== requiredRole) {
		return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
	}
	next();
}

export default verifyToken;
export { verifyRole };