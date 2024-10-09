import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

export interface UserAuth {
	userId: string;
	role: string;
}

/* Extend Request type and add userId */
declare global {
	namespace Express {
		interface Request {
			user: UserAuth;
		}
	}
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies["auth_token"];
	if (!token) {
		return res.status(401).json({ message: "Unauthorized access" })
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
		req.user = {
			userId: (decoded as JwtPayload).userId,
			role: (decoded as JwtPayload).role,
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