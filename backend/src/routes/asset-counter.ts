import express, { Request, Response } from 'express';
import AssetCounter from '../models/asset-counter.schema';
import { check, validationResult } from 'express-validator'
import verifyToken from '../middleware/auth';
import jwt from "jsonwebtoken";
import User from '../models/user.schema';
import { getCodeAndIncrement, getAssetIndexes } from '../utils/asset-counter';
import { auditAssets, deleteNotif } from '../utils/common';

const router = express.Router();

router.post('/', [
    check("type").exists().withMessage("Asset type is required").isIn(['Hardware', 'Software']).withMessage("Invalid asset type"),
    check("prefixCode").optional().isString().withMessage("Prefix Code must be a string"),
    check("threshold").optional().isNumeric().withMessage("Threshold must be a number"),
    check("category", "Asset category is required").custom((value, { req }) => {
        if (req.body.type === 'Hardware') {
            return !!value;
        }
        return true;
    })],
    verifyToken,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }
        try {
            const token = req.cookies.auth_token;
            const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

            if (decodedToken.role !== "ADMIN") {
                return res.status(403).json({ message: "Only users with admin role can perform this action" });
            }
            const currentUser = await User.findOne({ _id: decodedToken.userId });

            const data: any = req.body;
            const currentDate = new Date();

            data.created = currentDate;
            data.updated = currentDate;

            if (currentUser) {
                data.createdBy = `${currentUser.firstName} ${currentUser.lastName}`;
                data.updatedBy = `${currentUser.firstName} ${currentUser.lastName}`;
            }

            if (!data.counter) data['counter'] = 0;
            if (data['prefixCode']) data['prefixCode'] = data['prefixCode'].toUpperCase().trim();
            data['totalCount'] = 0;
            data['status'] = "";

            const existingCounter = await AssetCounter.aggregate().match({
                $expr: {
                    $or: [
                        {
                            $eq: ['$prefixCode', data['prefixCode']]
                        },
                        {
                            $and: [
                                {
                                    $eq: ['$type', data['type']]
                                },
                                {
                                    $eq: ['$category', data['category']]
                                }
                            ]
                        }
                    ]
                }
            })

            if (existingCounter.length > 0) return res.status(400).json({ message: "Prefix Code already exists or Asset Type and Category already have a prefix Code" });

            const newAssetCounter = new AssetCounter(data);
            await newAssetCounter.save();

            await auditAssets();
            return res.status(201).json(newAssetCounter);
        } catch (error) {
            console.error('Error creating asset counter:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
);

router.put('/:prefixCode', [
    check("type").exists().withMessage("Asset type is required").isIn(['Hardware', 'Software']).withMessage("Invalid asset type"),
    check("prefixCode").optional().isString().withMessage("Prefix Code must be a string"),
    check("threshold").optional().isNumeric().withMessage("Threshold must be a number"),
    check("category", "Asset category is required").custom((value, { req }) => {
        if (req.body.type === 'Hardware') {
            return !!value;
        }
        return true;
    })],
    verifyToken,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() })
        }
        try {
            const token = req.cookies.auth_token;
            const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

            if (decodedToken.role !== "ADMIN") {
                return res.status(403).json({ message: "Only users with admin role can perform this action" });
            }

            const prefixCode: string = req.params.prefixCode;
            const data: any = req.body;

            if (data['prefixCode']) data['prefixCode'] = data['prefixCode'].toUpperCase().trim();

            const existingAssetCounter = await AssetCounter.aggregate().match({
                $expr: {
                    $or: [
                        {
                            $in: ['$prefixCode', [prefixCode, data['prefixCode']]]
                        }
                    ]
                }
            })

            const findSameCounter = existingAssetCounter.find(f => { return f['prefixCode'] === data['prefixCode'] && f['_id'].toString() !== data['_id'] });
            if (findSameCounter) return res.status(400).json({ message: "Asset code already exists" });

            const findSameCatType = existingAssetCounter.find(f => { return f['category'] === data['category'] && f['type'] === data['type'] && f['_id'].toString() !== data['_id'] });
            if (findSameCatType) return res.status(400).json({ message: "Asset Type and Category already have a prefix Code" });

            const findCounter = existingAssetCounter.find(f => { return f['_id'].toString() === data['_id'] });
            if (!findCounter) return res.status(404).json({ message: "Asset Counter not found" });

            // delete data['counter'];
            delete data['totalCount'];
            delete data['status'];

            const ID = `${data._id}`;
            delete data._id;

            const currentUser = await User.findOne({ _id: decodedToken.userId });
            data.updated = new Date()
            if (currentUser) data.updatedBy = `${currentUser.firstName} ${currentUser.lastName}`;

            const updatedAsset = await AssetCounter.findOneAndUpdate({ _id: ID }, data, { new: true });

            await auditAssets();
            res.status(200).json(updatedAsset);
        } catch (error) {
            console.error('Error updating asset counter:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
);

router.get('/', async (req: Request, res: Response) => {
    try {
        const { type, prefixCode, category } = req.query;
        let query: any = {};

        if (type) query.type = type;

        if (category) query.status = category;

        if (prefixCode) query.category = prefixCode;

        let assetcounter;

        if (!Object.keys(query).length) assetcounter = await getAssetIndexes();
        else assetcounter = await AssetCounter.find(query);

        res.status(200).json(assetcounter);

    } catch (error) {
        console.error('Error fetching asset counter:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:prefixCode', async (req: Request, res: Response) => {
    try {
        const prefixCode: string = req.params.prefixCode;

        const assetcounter = await AssetCounter.findOne({ prefixCode });
        if (!assetcounter) return res.status(404).json({ message: 'Asset Counter not found' });

        res.status(200).json(assetcounter);
    } catch (error) {
        console.error('Error fetching asset counter:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:prefixCode', verifyToken, async (req: Request, res: Response) => {
    try {
        const token = req.cookies.auth_token;
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

        if (decodedToken.role !== "ADMIN") {
            return res.status(403).json({ message: "Only users with admin role can perform this action" });
        }

        const prefixCode: string = req.params.prefixCode;
        const assetcounter = await AssetCounter.findOne({ prefixCode });

        if (!assetcounter) return res.status(404).json({ message: 'Asset Counter not found' });

        await AssetCounter.deleteOne({ prefixCode });

        await auditAssets();
        await deleteNotif(`AssetCounter-${assetcounter['_id']}`)
        res.status(200).json({ message: 'Asset Counter deleted successfully' });
    } catch (error) {
        console.error('Error deleting asset counter:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
