import express, { Request, Response } from 'express';
import Hardware, { DeploymentHistory, HardwareType } from '../models/hardware.schema';
import Software, { SoftwareType } from '../models/software.schema'; 
import Asset, { AssetType } from '../models/asset.schema';
import { check, validationResult } from 'express-validator'
import verifyToken from '../middleware/auth';
import jwt from "jsonwebtoken";
import User from '../models/user.schema';

const router = express.Router();

/**
 * @openapi
 * /api/assets:
 *  post:
 *    tags:
 *      - Asset
 *    summary: Creates a new asset
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema: 
 *            $ref: '#/components/schemas/Hardware'
 *    responses:
 *      201:
 *        description: Asset created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Hardware'
 *      400:
 *        description: Invalid request body or asset code already exists
 *      403:
 *        description: Only users with admin role can perform this action
 *      500:
 *        description: Internal server error
 *    security:
 *      - bearerAuth: []
 */
router.post('/', [ 
    check("type").exists().withMessage("Asset type is required").isIn(['Hardware', 'Software']).withMessage("Invalid asset type"),
    check("brand").optional().isString().withMessage("Brand must be a string"),
    check("modelName").optional().isString().withMessage("Model name must be a string"),
    check("modelNo").optional().isString().withMessage("Model number must be a string"),
    check("serialNo").optional().isString().withMessage("Serial number must be a string"),
    // Additional checks for hardware-specific properties 
    check("status", "Asset status is required").custom((value, { req }) => {
        if (req.body.type === 'Hardware') {
            return !!value;
        }
        return true; 
    }),
    check("category", "Asset category is required").custom((value, { req }) => {
      if (req.body.type === 'Hardware') {
          return !!value;
      }
      return true; 
  }),
    check("processor").optional().isString().withMessage("Processor must be a string"),
    check("memory").optional().isString().withMessage("Memory must be a string"),
    check("storage").optional().isString().withMessage("Storage must be a string"),
    check("assignee").optional().isString().withMessage("Assignee must be a string"),
    check("purchaseDate").optional().isISO8601().toDate().withMessage("Invalid purchase date"),
    check("supplierVendor").optional().isString().withMessage("Supplier vendor must be a string"),
    check("pezaForm8105").optional().isString().withMessage("PEZA form 8105 must be a string"),
    check("pezaForm8106").optional().isString().withMessage("PEZA form 8106 must be a string"),
    check("isRGE").optional().isBoolean().withMessage("isRGE must be a boolean"),
    check("equipmentType", "Equipment type is required").custom((value, { req }) => {
      if (req.body.type === 'Hardware') {
          return !!value;
      }
      return true; 
    }),
    check("remarks").optional().isString().withMessage("Remarks must be a string"),
    check("deploymentDate").optional().isISO8601().toDate().withMessage("Invalid deployment date"),
    check("recoveredFrom").optional().isString().withMessage("Recovered from must be a string"),
    check("recoveryDate").optional().isISO8601().toDate().withMessage("Invalid recovery date"),
    // Additional checks for software-specific properties
    check("license").optional().isString().withMessage("License must be a string"),
    check("version").optional().isString().withMessage("Version must be a string"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
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

      if (data.type === 'Hardware') {
        const existingAsset = await Hardware.findOne({ code: data.code });
        if (existingAsset) {
          return res.status(400).json({ message: "Asset code already exists" });
        }

        const newAsset = new Hardware(data);
        await newAsset.save();

        return res.status(201).json(newAsset);
      } else { 
        const existingAsset = await Software.findOne({ code: data.code });
        if (existingAsset) {
          return res.status(400).json({ message: "Asset code already exists" });
        }

        const newAsset = new Software(data);
        await newAsset.save();

        return res.status(201).json(newAsset);
      }
    } catch (error) {
      console.error('Error creating asset:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

/**
 * @openapi
 * /api/assets/deploy/{code}:
 *  put:
 *    tags:
 *      - Asset
 *    summary: Update deployment properties of asset via its code
 *    parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        schema:
 *          type: string
 *        description: Asset code
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AssetUpdate'
 *    responses:
 *      200:
 *        description: Updated assets
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Hardware'
 *      404:
 *        description: Asset code mismatch or asset is already deployed
 *      500:
 *        description: Internal server error
 *    security:
 *      - bearerAuth: []
 */
router.put('/deploy/:code', [
    check('assignee').optional().isString().withMessage('Assignee must be a string'),
  ], 
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

      const code: string = req.params.code;
      const data: any = req.body;

      if (data.code !== code) {
        return res.status(400).json({ message: 'Asset code mismatch' });
      }

      const existingAsset = await Hardware.findOne({ code });
      if (!existingAsset) {
        return res.status(404).json({ message: 'Asset not found' });
      }

      if (existingAsset.status === 'Deployed') {
        return res.status(400).json({ message: 'This asset is already deployed' });
      }
      data.status = 'Deployed'

      const currentUser = await User.findOne({ _id: decodedToken.userId });
      data.updated = new Date()
      if (currentUser) {
        data.updatedBy = `${currentUser.firstName} ${currentUser.lastName}`;
      }

      const deploymentRecord = {
        deploymentDate: data.deploymentDate,
        assignee: data.assignee,
      };

      data.deploymentHistory = [...existingAsset.deploymentHistory, deploymentRecord];

      let updatedAsset;
      await Hardware.updateOne({ code: data.code }, data);
      updatedAsset = await Hardware.findOne({ code });
      
      res.status(200).json(updatedAsset);
    } catch (error) {
      console.error('Error updating assets:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

/**
 * @openapi
 * /api/assets/retrieve/{code}:
 *  put:
 *    tags:
 *      - Asset
 *    summary: Update recovery properties of asset via its code
 *    parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        schema:
 *          type: string
 *        description: Asset code
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AssetUpdate'
 *    responses:
 *      200:
 *        description: Updated assets
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Hardware'
 *      404:
 *        description: Asset code mismatch or asset is not yet deployed
 *      500:
 *        description: Internal server error
 *    security:
 *      - bearerAuth: []
 */
router.put('/retrieve/:code', [
    check('recoveredFrom').optional().isString().withMessage('Recovered From must be a string'),
  ], 
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

      const code: string = req.params.code;
      const data: any = req.body;

      if (data.code !== code) {
        return res.status(400).json({ message: 'Asset code mismatch' });
      }

      const existingAsset = await Hardware.findOne({ code });
      if (!existingAsset) {
        return res.status(404).json({ message: 'Asset not found' });
      }

      if (existingAsset.status !== 'Deployed') {
        return res.status(400).json({ message: 'This asset is not deployed' });
      }
      data.status = 'IT Storage'

      const currentUser = await User.findOne({ _id: decodedToken.userId });
      data.updated = new Date()
      if (currentUser) {
        data.updatedBy = `${currentUser.firstName} ${currentUser.lastName}`;
      }

      data.assignee = '';
      data.deploymentDate = null;

      const deploymentHistory = existingAsset.deploymentHistory;

      if (deploymentHistory.length > 0) {
          const lastDeploymentRecordIndex = deploymentHistory.length - 1;
          const lastDeploymentRecord = deploymentHistory[lastDeploymentRecordIndex];
      
          lastDeploymentRecord.recoveryDate = data.recoveryDate;
      } else {
          deploymentHistory.push({
              deploymentDate: data.recoveryDate,
              assignee: data.recoveredFrom,
              recoveryDate: data.recoveryDate,
          });
      }
      
      data.deploymentHistory = deploymentHistory;
      
      let updatedAsset;
      await Hardware.updateOne({ code: data.code }, data);
      updatedAsset = await Hardware.findOne({ code });      
      
      res.status(200).json(updatedAsset);
    } catch (error) {
      console.error('Error updating assets:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

/**
 * @openapi
 * /api/assets/{code}:
 *  put:
 *    tags:
 *      - Asset
 *    summary: Update an asset by its code
 *    parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        schema:
 *          type: string
 *        description: Asset code
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Hardware'
 *    responses:
 *      200:
 *        description: Asset updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Hardware'
 *      400:
 *        description: Invalid request body or asset code already exists
 *      403:
 *        description: Only users with admin role can perform this action
 *      404:
 *        description: Asset not found
 *      500:
 *        description: Internal server error
 *    security:
 *      - bearerAuth: []
 */
router.put('/:code', [
    check("type").exists().withMessage("Asset type is required").isIn(['Hardware', 'Software']).withMessage("Invalid asset type"),
    check("brand").optional().isString().withMessage("Brand must be a string"),
    check("modelName").optional().isString().withMessage("Model name must be a string"),
    check("modelNo").optional().isString().withMessage("Model number must be a string"),
    check("serialNo").optional().isString().withMessage("Serial number must be a string"),
    // Additional checks for hardware-specific properties 
    check("status", "Asset status is required").custom((value, { req }) => {
        if (req.body.type === 'Hardware') {
            return !!value;
        }
        return true; 
    }),
    check("category", "Asset category is required").custom((value, { req }) => {
      if (req.body.type === 'Hardware') {
          return !!value;
      }
      return true; 
  }),
    check("processor").optional().isString().withMessage("Processor must be a string"),
    check("memory").optional().isString().withMessage("Memory must be a string"),
    check("storage").optional().isString().withMessage("Storage must be a string"),
    check("assignee").optional().isString().withMessage("Assignee must be a string"),
    check("purchaseDate").optional().isISO8601().toDate().withMessage("Invalid purchase date"),
    check("supplierVendor").optional().isString().withMessage("Supplier vendor must be a string"),
    check("pezaForm8105").optional().isString().withMessage("PEZA form 8105 must be a string"),
    check("pezaForm8106").optional().isString().withMessage("PEZA form 8106 must be a string"),
    check("isRGE").optional().isBoolean().withMessage("isRGE must be a boolean"),
    check("equipmentType", "Equipment type is required").custom((value, { req }) => {
      if (req.body.type === 'Hardware') {
          return !!value;
      }
      return true; 
    }),
    check("remarks").optional().isString().withMessage("Remarks must be a string"),
    check("deploymentDate").optional().isISO8601().toDate().withMessage("Invalid deployment date"),
    check("recoveredFrom").optional().isString().withMessage("Recovered from must be a string"),
    check("recoveryDate").optional().isISO8601().toDate().withMessage("Invalid recovery date"),
    // Additional checks for software-specific properties
    check("license").optional().isString().withMessage("License must be a string"),
    check("version").optional().isString().withMessage("Version must be a string"),
  ],
  verifyToken,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() })
    }
    try {
      const token = req.cookies.auth_token;
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

      if (decodedToken.role !== "ADMIN") {
        return res.status(403).json({ message: "Only users with admin role can perform this action" });
      }

      const code: string = req.params.code;
      const data: any = req.body;

      console.log(data)

      const existingAssetCode = await Asset.findOne({ code: data.code });
      if (existingAssetCode && existingAssetCode._id.toString() !== data._id) {
        return res.status(400).json({ message: "Asset code already exists" });
      }
      delete data._id;

      const existingAsset = await Asset.findOne({ code });

      if (!existingAsset) {
        return res.status(404).json({ message: 'Asset not found' });
      }

      const currentUser = await User.findOne({ _id: decodedToken.userId });
      data.updated = new Date()
      if (currentUser) {
        data.updatedBy = `${currentUser.firstName} ${currentUser.lastName}`;
      }

      let updatedAsset;
      if (data.type === 'Hardware') {
        // Remove undefined date properties and set them to null
        data.deploymentDate ??= null;
        data.purchaseDate ??= null;
        data.recoveryDate ??= null;

        // Update the asset
        updatedAsset = await Hardware.findOneAndUpdate({ code: code }, data, { new: true });
      } else {
        updatedAsset = await Software.findOneAndUpdate({ code: code }, data, { new: true });
      }
      
      res.status(200).json(updatedAsset);
    } catch (error) {
      console.error('Error updating asset:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

/**
 * @openapi
 * /api/assets:
 *  get:
 *    tags:
 *      - Asset
 *    summary: Get all assets
 *    parameters:
 *      - in: query
 *        name: type
 *        schema:
 *          type: string
 *        description: Filter assets by type (e.g. Hardware, Software)
 *      - in: query
 *        name: status
 *        schema:
 *          type: string
 *        description: Filter assets by status (e.g. Deployed, Damaged, IT Storage, etc.)
 *      - in: query
 *        name: category
 *        schema:
 *          type: string
 *        description: Filter assets by category (e.g. Laptop, Mobile, Keyboard, Mouse, etc.)
 *    responses:
 *      200:
 *        description: A list of assets
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Hardware'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, status, category } = req.query;
    let query: any = {}; 

    if (type) {
      query.type = type; 
    }

    if (status) {
      query.status = status; 
    }

    if (category) {
      query.category = category;
    }

    let assets;

    if (Object.keys(query).length === 0) {
      assets = await Asset.find();
    } else {
      assets = await Asset.find(query);
    }

    res.status(200).json(assets);

  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @openapi
 * /api/assets/count/{property}/{value}:
 *  get:
 *    tags:
 *      - Asset
 *    summary: Get total number of assets with a specific property value
 *    parameters:
 *      - in: path
 *        name: property
 *        required: false
 *        schema:
 *          type: string
 *        description: Asset property to filter by
 *      - in: path
 *        name: value
 *        required: false
 *        schema:
 *          type: string
 *        description: Value of the property to filter by
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              type: number
 *              description: Total number of assets with the specified property value
 *              example:
 *                10
 *      500:
 *        description: Internal Server Error
 *    security:
 *      - bearerAuth: []
 */
router.get('/count/:property?/:value?', async (req: Request, res: Response) => {
  try {
    const { property, value } = req.params;

    let count;

    if (property && value) {
      count = await Asset.countDocuments({ [property]: value });
    } else {
      count = await Asset.countDocuments();
    }

    res.status(200).json(count);
  } catch (error) {
    console.error('Error fetching asset count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @openapi
 * /api/assets/uniqueValues/{property}:
 *  get:
 *    tags:
 *      - Asset
 *    summary: Get array of unique values for an asset's property
 *    parameters:
 *      - in: path
 *        name: property
 *        required: true
 *        schema:
 *          type: string
 *        description: Asset property to parse unique values from
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: string
 *              example:
 *                - Laptop
 *                - Headset
 *                - Monitors
 *                - Mouse
 *                - Connectors/Adapters
 *                - Desktop
 *                - Keyboard
 *                - Others
 *                - Mobile
 *      404:
 *        description: Asset not found
 *      500:
 *        description: Internal Server Error
 *    security:
 *      - bearerAuth: []
 */
router.get('/uniqueValues/:property', async (req: Request, res: Response) => {
  try {
    const { property } = req.params;
    let query: any = {}; 

    let aggregationPipeline: any[] = [];

    // Add a $match stage to filter out null, undefined, and empty strings
    aggregationPipeline.push({
      $match: {
        [property]: {
          $ne: null,          // Exclude null values
          $exists: true,      // Exclude undefined values
          $not: { $eq: '' }   // Exclude empty strings
        }
      }
    });

    if (Object.keys(query).length === 0) {
      aggregationPipeline.push({
        $group: {
          _id: `$${property}`
        }
      });
    } else {
      aggregationPipeline.push({
        $match: query
      }, {
        $group: {
          _id: `$${property}`
        }
      });
    }

    const uniqueValues = await Asset.aggregate(aggregationPipeline);
    const values = uniqueValues.map((valueObj: any) => valueObj._id);

    res.status(200).json(values);

  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @openapi
 * /api/assets/{property}/{value}:
 *  get:
 *    tags:
 *      - Asset
 *    summary: Get all assets via a specific property
 *    parameters:
 *      - in: params
 *        name: property
 *        schema:
 *          type: string
 *        description: Property to filter assets by
 *      - in: params
 *        name: value
 *        schema:
 *          type: string
 *        description: Value of property to filter assets by
 *    responses:
 *      200:
 *        description: A list of assets
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Hardware'
 */
router.get('/:property/:value', async (req: Request, res: Response) => {
  try {
    const { property, value } = req.params;
    let query: any = {};
    query[property as string] = value

    let assets;

    if (Object.keys(query).length === 0) {
      assets = await Asset.find();
    } else {
      assets = await Asset.find(query);
    }

    res.status(200).json(assets);

  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @openapi
 * /api/assets/{property}/{value}:
 *  put:
 *    tags:
 *      - Asset
 *    summary: Update all assets with a specific property-value pair
 *    parameters:
 *      - in: path
 *        name: property
 *        required: true
 *        schema:
 *          type: string
 *        description: Property to filter assets by
 *      - in: path
 *        name: value
 *        required: true
 *        schema:
 *          type: string
 *        description: Value of property to filter assets by
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AssetUpdate'
 *    responses:
 *      200:
 *        description: Updated assets
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Hardware'
 *      404:
 *        description: No assets found with the specified property-value pair
 *      500:
 *        description: Internal server error
 *    security:
 *      - bearerAuth: []
 */
router.put('/:property/:value', [
    check('category').optional().isString().withMessage('Category must be a string'),
    check('processor').optional().isString().withMessage('Processor must be a string'),
    check('memory').optional().isString().withMessage('Memory must be a string'),
    check('storage').optional().isString().withMessage('Storage must be a string'),
    check('status').optional().isString().withMessage('Status must be a string'),
    check('assignee').optional().isString().withMessage('Assignee must be a string'),
    check('purchaseDate').optional().isISO8601().toDate().withMessage('Invalid purchase date'),
    check('supplierVendor').optional().isString().withMessage('Supplier vendor must be a string'),
    check('pezaForm8105').optional().isString().withMessage('PEZA form 8105 must be a string'),
    check('pezaForm8106').optional().isString().withMessage('PEZA form 8106 must be a string'),
    check('isRGE').optional().isBoolean().withMessage('isRGE must be a boolean'),
    check('equipmentType').optional().isString().withMessage('Equipment type must be a string'),
    check('remarks').optional().isString().withMessage('Remarks must be a string'),
    check('deploymentDate').optional().isISO8601().toDate().withMessage('Invalid deployment date'),
    check('recoveredFrom').optional().isString().withMessage('Recovered from must be a string'),
    check('recoveryDate').optional().isISO8601().toDate().withMessage('Invalid recovery date'),
  ], 
  verifyToken,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() })
    }
    try {
      const token = req.cookies.auth_token;
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

      if (decodedToken.role !== "ADMIN") {
        return res.status(403).json({ message: "Only users with admin role can perform this action" });
      }

      const { property, value } = req.params;
      const updateData: any = req.body;

      const updateDataKeys = Object.keys(updateData);
      if (updateDataKeys.length === 0) {
        return res.status(400).json({ message: 'Request body cannot be empty' });
      }
      if (property !== updateDataKeys[0]) {
        return res.status(400).json({ message: `Property '${property}' in URL must match property in request body` });
      }

      const existingAssets = await Asset.find({ [property]: value });

      if (!existingAssets || existingAssets.length === 0) {
        return res.status(404).json({ message: `No assets found with { ${property} : ${value} }` });
      }

      await Hardware.updateMany({ [property]: value }, updateData);
      res.status(200).json({ message: 'Assets updated successfully' });
    } catch (error) {
      console.error('Error updating assets:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

/**
 * @openapi
 * /api/assets/{code}:
 *  get:
 *    tags:
 *      - Asset
 *    summary: Get an asset by its code
 *    parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        schema:
 *          type: string
 *        description: Asset code
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Hardware'
 *      404:
 *        description: Asset not found
 *      500:
 *        description: Internal server error
 */
router.get('/:code', async (req: Request, res: Response) => {
  try {
    const code: string = req.params.code;

    const asset = await Asset.findOne({ code });

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.status(200).json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @openapi
 * /api/assets/{property}/{value}:
 *  delete:
 *    tags:
 *      - Asset
 *    summary: Delete assets via a specific property
 *    parameters:
 *      - in: path
 *        name: property
 *        schema:
 *          type: string
 *        description: Property to filter assets by
 *      - in: path
 *        name: value
 *        schema:
 *          type: string
 *        description: Value of property to filter assets by
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Success message
 *      404:
 *        description: No assets found
 *      500:
 *        description: Internal server error
 */
router.delete('/:property/:value', verifyToken, async (req: Request, res: Response) => {
  try {
    const token = req.cookies.auth_token;
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    if (decodedToken.role !== "ADMIN") {
      return res.status(403).json({ message: "Only users with admin role can perform this action" });
    }

    const { property, value } = req.params;
    const query: any = {};
    query[property] = value;

    const deletedAssets = await Asset.deleteMany(query);

    if (deletedAssets.deletedCount === 0) {
      return res.status(404).json({ message: 'No assets found' });
    }

    res.status(200).json({ message: 'Assets deleted successfully' });
  } catch (error) {
    console.error('Error deleting assets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @openapi
 * /api/assets/{code}:
 *  delete:
 *    tags:
 *      - Asset
 *    summary: Delete an asset by its code
 *    parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        schema:
 *          type: string
 *        description: Asset code
 *    responses:
 *      200:
 *        description: Asset deleted successfully
 *      403:
 *        description: Only users with admin role can perform this action
 *      404:
 *        description: Asset not found
 *      500:
 *        description: Internal Server Error
 *    security:
 *      - bearerAuth: []
 */
router.delete('/:code', verifyToken, async (req: Request, res: Response) => {
  try {
    const token = req.cookies.auth_token;
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    if (decodedToken.role !== "ADMIN") {
      return res.status(403).json({ message: "Only users with admin role can perform this action" });
    }

    const code: string = req.params.code;
    const asset = await Asset.findOne({ code });

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    await Asset.deleteOne({ code });

    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
