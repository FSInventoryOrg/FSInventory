import express, { Request, Response } from 'express';
import verifyToken from '../middleware/auth';
import { getFile } from '../utils/common';

const router = express.Router();

export const getVersion = async() => {
    const backend: any = await getFile('backend/package.json');
    const frontend: any = await getFile('frontend/package.json');

    if(backend && frontend) {
        try {
            const backendInfo = JSON.parse(backend.toString())
            const frontendInfo = JSON.parse(frontend.toString())

            return {
                backend: {
                    name: backendInfo?.name,
                    version: backendInfo?.version
                },
                frontend: {
                    name: frontendInfo?.name,
                    version: frontendInfo?.version
                }
            }
        } catch(err) {
            return null
        }
    } else return null
}
router.get('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const versions = await getVersion();

        if(!versions) return res.status(404).json({message: 'Versions could not be identified'})
        return res.status(200).json(versions);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;