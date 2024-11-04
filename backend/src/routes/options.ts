import express, { Request, Response } from "express";
import Option, { StatusOptions } from "../models/options.schema"; // Import your Mongoose model
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import jwt from "jsonwebtoken";
import { auditAssets, deleteNotif } from "../utils/common";
import AssetCounter from "../models/asset-counter.schema";

const router = express.Router();

/**
 * @openapi
 * /api/options/{property}:
 *  post:
 *    tags:
 *      - Options
 *    summary: Add a new option value
 *    parameters:
 *      - in: path
 *        name: property
 *        required: true
 *        schema:
 *          type: string
 *        description: Property to add the value to
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              value:
 *                type: string
 *    responses:
 *      200:
 *        description: Option updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Option'
 *      400:
 *        description: Value already exists in option or value is empty
 *      403:
 *        description: Only users with admin role can perform this action
 *      500:
 *        description: Internal server error
 *    security:
 *      - bearerAuth: []
 */
router.post(
  "/:property",
  [check("value").exists().withMessage("Value is required")],
  verifyToken,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const token = req.cookies.auth_token;
      const decodedToken: any = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      );

      if (decodedToken.role !== "ADMIN") {
        return res.status(403).json({
          message: "Only users with admin role can perform this action",
        });
      }

      const { property } = req.params;
      const { type } = req.query;
      let { value } = req.body;

      if (value === "") {
        return res.status(400).json({ error: "Value cannot be empty" });
      }

      let option = await Option.findOne();
      if (!option) {
        option = new Option({});
      }

      let isStatusIncluded = false;

      // Convert value to object if property is "status" or "category" and value is a string
      if (property === "status" || property === "category") {
        if (typeof value === "string") {
          value = { value, type };
        }

        if (property === "status") isStatusIncluded = true;
      }

      const propertyValues = option.get(property) || [];

      // Check if the value already exists in the array for the specified property
      if (typeof value === "object") {
        const existingValue = propertyValues.find(
          (val: any) => val.value.toLowerCase() === value.value.toLowerCase()
        );
        if (existingValue) {
          return res.status(400).json({
            message: "Value already exists for the specified property",
          });
        }
      } else {
        const existingValue = propertyValues.find(
          (propertyVal: string) =>
            propertyVal.toLowerCase() === value?.toLowerCase()
        );
        if (existingValue) {
          return res.status(400).json({
            message: "Value already exists for the specified property",
          });
        }
      }

      // Append the new value to the array
      option.set(property, [...propertyValues, value]);

      await option.save();

      if (isStatusIncluded) await auditAssets();

      res.status(200).json(option);
    } catch (error) {
      console.error("Error adding or updating option:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/**
 * @openapi
 * /api/options/defaults:
 *  put:
 *    tags:
 *      - Options
 *    summary: Update default options
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Defaults'
 *    responses:
 *      200:
 *        description: Defaults updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Options'
 *      400:
 *        description: Bad request, invalid data provided
 *      401:
 *        description: Unauthorized, user not authenticated
 *      403:
 *        description: Forbidden, user does not have admin privileges
 *      500:
 *        description: Internal server error
 *    security:
 *      - bearerAuth: []
 */
router.put(
  "/defaults",
  [
    check("status").optional().isString(),
    check("softwareCategory").optional().isString(),
    check("hardwareCategory").optional().isString(),
    check("equipmentType").optional().isString(),
    check("deployableStatus").isArray(),
    check("retrievableStatus").optional().isString(),
    check("inventoryColumns").optional().isArray(),
  ],
  verifyToken,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const token = req.cookies.auth_token;
      const decodedToken: any = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      );

      if (decodedToken.role !== "ADMIN") {
        return res.status(403).json({
          message: "Only users with admin role can perform this action",
        });
      }

      let option = await Option.findOne();
      if (!option) {
        option = new Option({});
      }

      if (!option.defaults) {
        option.defaults = {};
      }

      const {
        status,
        softwareCategory,
        hardwareCategory,
        equipmentType,
        deployableStatus,
        retrievableStatus,
        inventoryColumns,
      } = req.body;

      if (status !== undefined) {
        option.defaults.status = status;
      }
      if (softwareCategory !== undefined) {
        option.defaults.softwareCategory = softwareCategory;
      }
      if (hardwareCategory !== undefined) {
        option.defaults.hardwareCategory = hardwareCategory;
      }
      if (equipmentType !== undefined) {
        option.defaults.equipmentType = equipmentType;
      }
      if (deployableStatus !== undefined) {
        option.defaults.deployableStatus = deployableStatus;
      }
      if (retrievableStatus !== undefined) {
        option.defaults.retrievableStatus = retrievableStatus;
      }
      if (inventoryColumns !== undefined) {
        option.defaults.inventoryColumns = inventoryColumns;
      }

      await option.save();

      res.status(200).json(option);
    } catch (error) {
      console.error("Error updating defaults:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/**
 * @openapi
 * /api/options/{property}:
 *  put:
 *    tags:
 *      - Options
 *    summary: Update an option value by its index
 *    parameters:
 *      - in: path
 *        name: property
 *        required: true
 *        schema:
 *          type: string
 *        description: Property to update the value of
 *      - in: query
 *        name: index
 *        schema:
 *          type: integer
 *        description: Index of the value to be updated
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              value:
 *                type: string
 *    responses:
 *      200:
 *        description: Option updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Success message
 *      400:
 *        description: Invalid update index or value already exists in option
 *      403:
 *        description: Only users with admin role can perform this action
 *      404:
 *        description: Options not found or property not found in options
 *      500:
 *        description: Internal server error
 *    security:
 *      - bearerAuth: []
 */
router.put(
  "/:property",
  [check("value").exists().withMessage("Value is required")],
  verifyToken,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { property } = req.params;
      let { value } = req.body;
      const updateIndex = Number(req.query.index); // Get the index from the query string

      let isStatusIncluded = false;

      const option = await Option.findOne();
      if (!option) {
        return res.status(404).json({ message: "Options not found" });
      }

      if (!option.get(property)) {
        return res
          .status(404)
          .json({ message: `Option '${property}' not found in options` });
      }

      if (
        isNaN(updateIndex) ||
        updateIndex < 0 ||
        updateIndex >= option.get(property).length
      ) {
        return res.status(400).json({ error: "Invalid update index" });
      }

      // Convert value to object if property is "status" or "category" and value is a string
      if (property === "status" || property === "category") {
        if (typeof value === "string") {
          value = { value };
        }

        if (property === "status") isStatusIncluded = true;
      }

      const propertyValues = option.get(property) || [];
      // Check if the value already exists in the array for the specified property
      // Check if the value already exists in the array for the specified property
      if (typeof value === "object") {
        const existingValue = propertyValues.find(
          (val: any) => val.value.toLowerCase() === value.value.toLowerCase()
        );
        if (existingValue) {
          return res.status(400).json({
            message: "Value already exists for the specified property",
          });
        }
      } else {
        const existingValue = propertyValues.find(
          (propertyVal: string) =>
            propertyVal.toLowerCase() === value?.toLowerCase()
        );
        if (existingValue) {
          return res.status(400).json({
            message: "Value already exists for the specified property",
          });
        }
      }

      // Update element at the specified index
      option.get(property)[updateIndex] = value;

      await option.save();

      if (isStatusIncluded) await auditAssets();

      res.status(200).json({ message: "Option updated successfully" });
    } catch (error) {
      console.error("Error updating option:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/**
 * @openapi
 * /api/options/{property}:
 *  delete:
 *    tags:
 *      - Options
 *    summary: Delete an option value
 *    parameters:
 *      - in: path
 *        name: property
 *        required: true
 *        schema:
 *          type: string
 *        description: Property to delete the value from
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              value:
 *                type: string
 *    responses:
 *      200:
 *        description: Value removed from option successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Success message
 *      400:
 *        description: Value does not exist in option or property does not exist in options
 *      403:
 *        description: Only users with admin role can perform this action
 *      404:
 *        description: Options not found or property not found in options
 *      500:
 *        description: Internal server error
 *    security:
 *      - bearerAuth: []
 */
router.delete(
  "/:property",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const token = req.cookies.auth_token;
      const decodedToken: any = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      );

      if (decodedToken.role !== "ADMIN") {
        return res.status(403).json({
          message: "Only users with admin role can perform this action",
        });
      }

      const { property } = req.params;
      const { value } = req.body;

      // let isStatusIncluded = false;
      let shouldAuditAssets = false;

      // Check if the options document exists
      const option = await Option.findOne();
      if (!option) {
        return res.status(404).json({ message: "Options not found" });
      }

      // Check if the property exists in the options document
      if (!option.get(property)) {
        return res
          .status(404)
          .json({ message: `Option '${property}' not found in options` });
      }

      // Remove the specified value from the array property
      if (property === "status" || property === "category") {
        const propertyValue = option.get(property) as StatusOptions[];

        // Check if the value exists in the array
        if (!propertyValue.some((option) => option.value === value)) {
          return res.status(400).json({
            message: `Value '${value}' does not exist in option '${property}'`,
          });
        }

        const updatedProperty = propertyValue.filter(
          (option) => option.value !== value
        );
        option.set(property, updatedProperty);
        shouldAuditAssets = true;
      } else {
        const propertyValue: string[] = option.get(property);
        if (!propertyValue.includes(value)) {
          return res.status(400).json({
            message: `Value '${value}' does not exist in option '${property}'`,
          });
        }
        const updatedProperty = propertyValue.filter((item) => item !== value);
        option.set(property, updatedProperty);
      }

      await option.save();

      if (shouldAuditAssets) await auditAssets();

      if (property === "category") {
        // Delete associated asset index/counter for category
        const assetCounter = await AssetCounter.findOneAndDelete({
          category: value,
        });
        if (assetCounter) {
          // Update tracking and remove notifications for deleted category
          await deleteNotif(`AssetCounter-${assetCounter["_id"]}`);
        }
      }

      res.status(200).json({
        message: `Value '${value}' removed from option '${property}' successfully`,
      });
    } catch (error) {
      console.error("Error deleting value from option:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/:property", async (req: Request, res: Response) => {
  try {
    const { property } = req.params;

    // Retrieve the options document
    const option = await Option.findOne();

    // Check if the options document exists and if the property exists in it
    if (!option || !option.get(property)) {
      return res
        .status(404)
        .json({ message: `property '${property}' not found in options` });
    }

    // Return the value of the specified property
    res.status(200).json({ value: option.get(property) });
  } catch (error) {
    console.error("Error fetching option value:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    // Retrieve all options documents
    const options = await Option.find();

    // Return the options array
    res.status(200).json(options);
  } catch (error) {
    console.error("Error fetching options:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
