import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import verifyToken from '../middleware/auth';
import { setFSEnvironment, setGitlabCreds } from '../utils/common';

const router = express.Router();

router.patch('/environment', verifyToken, async (req: Request, res: Response) => {
    try {
        const token = req.cookies.auth_token;
        const decodedToken: any = await fetch(`${process.env.ROCKS_DEV_API_URL}/auth/check`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (decodedToken.role !== "ADMIN") {
            return res.status(403).json({ message: "Only users with admin role can perform this action" });
        }

        const data: any = req.body;

        if (data?.mongodb_connection_string) {
            const envData = {
                mongodb_connection_string: data['mongodb_connection_string']
            }

            await setFSEnvironment(envData)
        }

        if (data?.gitlab_user && data?.gitlab_token) {
            let resultSet = await setGitlabCreds(data.gitlab_user, data.gitlab_token);

            if (!resultSet) return res.status(422).json({ message: "Unable to change the deployer credentials. Please check the validity of user and token" });
        }

        return res.status(200).json({ message: "Configuration has been set, Please restart the server to take effect" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;