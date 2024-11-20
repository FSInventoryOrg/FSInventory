import express, { Request, Response } from "express";
import Hardware, { HardwareType } from "../models/hardware.schema";
import Software from "../models/software.schema";
import Asset from "../models/asset.schema";
import { check, validationResult } from "express-validator";
import verifyToken, { verifyRole } from "../middleware/auth";
import { getCodeAndIncrement } from "../utils/asset-counter";
import { auditAssets } from "../utils/common";
import Employee from "../models/employee.schema";

const router = express.Router();

const checkSerialNo = async (serialNum: string, assetID?: string) => {
  const recordSerial = await Asset.aggregate().match({
    $expr: {
      $and: [{ $eq: ["$serialNo", serialNum] }],
    },
  });

  if (recordSerial.length > 1) return "Multiple Serial Number Entity Found";
  else if (recordSerial.length === 1) {
    if (recordSerial[0]["_id"].toString() === assetID) return "SUCCESS";
    else return "Serial Number Already Exists";
  } else return "SUCCESS";
};

const emplyeeSnapper = async (assets: any) => {
  const employees: any = await Employee.aggregate()
    .match({ $expr: {} })
    .project({
      idNum: "$code",
      name: { $concat: ["$firstName", " ", "$lastName"] },
    });

  assets = assets.reduce((accum: any[], value: any) => {
    const findAssignee = employees.find(
      (f: any) => f["idNum"] === value["assignee"]
    );
    const findRecoveredFrom = employees.find(
      (f: any) => f["idNum"] === value["recoveredFrom"]
    );

    if (findAssignee) value["_addonData_assignee"] = findAssignee["name"];
    else value["_addonData_assignee"] = value["assignee"];

    if (findRecoveredFrom)
      value["_addonData_recoveredFrom"] = findRecoveredFrom["name"];
    else value["_addonData_recoveredFrom"] = value["recoveredFrom"];

    if (Array.isArray(value?.deploymentHistory)) {
      if (value.deploymentHistory.length > 0) {
        value.deploymentHistory.forEach((el: any, index: number) => {
          const findHistAssignee = employees.find(
            (f: any) => f["idNum"] === el["assignee"]
          );

          if (findHistAssignee)
            value.deploymentHistory[index]["_addonData_assignee"] =
              findHistAssignee["name"];
          else
            value.deploymentHistory[index]["_addonData_assignee"] =
              el["assignee"];
        });
      }
    }

    accum.push(value);
    return accum;
  }, []);

  return assets;
};

router.post(
  "/",
  [
    check("type")
      .exists()
      .withMessage("Asset type is required")
      .isIn(["Hardware", "Software"])
      .withMessage("Invalid asset type"),
    check("brand").optional().isString().withMessage("Brand must be a string"),
    check("modelName")
      .optional()
      .isString()
      .withMessage("Model name must be a string"),
    check("modelNo")
      .optional()
      .isString()
      .withMessage("Model number must be a string"),
    check("serialNo")
      .optional()
      .isString()
      .withMessage("Serial number must be a string"),
    // Additional checks for hardware-specific properties
    check("status", "Asset status is required").custom((value, { req }) => {
      if (req.body.type === "Hardware") {
        return !!value;
      }
      return true;
    }),
    check("category", "Asset category is required").custom((value, { req }) => {
      if (req.body.type === "Hardware") {
        return !!value;
      }
      return true;
    }),
    check("processor")
      .optional()
      .isString()
      .withMessage("Processor must be a string"),
    check("memory")
      .optional()
      .isString()
      .withMessage("Memory must be a string"),
    check("storage")
      .optional()
      .isString()
      .withMessage("Storage must be a string"),
    check("assignee")
      .optional()
      .isString()
      .withMessage("Assignee must be a string"),
    check("purchaseDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid purchase date"),
    check("supplierVendor")
      .optional()
      .isString()
      .withMessage("Supplier vendor must be a string"),
    check("pezaForm8105")
      .optional()
      .isString()
      .withMessage("PEZA form 8105 must be a string"),
    check("pezaForm8106")
      .optional()
      .isString()
      .withMessage("PEZA form 8106 must be a string"),
    check("isRGE")
      .optional()
      .isBoolean()
      .withMessage("isRGE must be a boolean"),
    check("equipmentType", "Equipment type is required").custom(
      (value, { req }) => {
        if (req.body.type === "Hardware") {
          return !!value;
        }
        return true;
      }
    ),
    check("remarks")
      .optional()
      .isString()
      .withMessage("Remarks must be a string"),
    check("notifyRemarks")
      .optional()
      .isBoolean()
      .withMessage("Notify Remarks must be a boolean"),
    check("deploymentDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid deployment date"),
    check("recoveredFrom")
      .optional()
      .isString()
      .withMessage("Recovered from must be a string"),
    check("recoveryDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid recovery date"),
    // Additional checks for software-specific properties
    check("license")
      .optional()
      .isString()
      .withMessage("License must be a string"),
    check("version")
      .optional()
      .isString()
      .withMessage("Version must be a string"),
  ],
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const { user } = req.cookies;

      const currentUser = JSON.parse(user);

      const data: any = req.body;
      const currentDate = new Date();

      data.created = currentDate;
      data.updated = currentDate;

      if (currentUser) {
        data.createdBy = `${currentUser.firstName} ${currentUser.lastName}`;
        data.updatedBy = `${currentUser.firstName} ${currentUser.lastName}`;
      }

      const existingAsset = await Asset.findOne({ code: data.code });
      if (existingAsset) {
        return res.status(400).json({ message: "Asset code already exists" });
      }

      if (data["assignee"]) {
        data["status"] = "Deployed";
        data["deploymentHistory"] = [
          {
            assignee: data["assignee"],
            deploymentDate: data["deploymentDate"]
              ? data["deploymentDate"]
              : new Date(),
          },
        ];
      } else if (data["status"] === "Deployed" && !data["assignee"])
        data["status"] = "IT Storage";

      if (data["recoveredFrom"]) {
        const recovery = {
          assignee: data["recoveredFrom"],
          recoveryDate: data["recoveryDate"]
            ? data["recoveryDate"]
            : new Date(),
        };
        if (!Array.isArray(data["deploymentHistory"]))
          data["deploymentHistory"] = [recovery];
        else {
          data["deploymentHistory"].push(recovery);
        }
      }

      if (!data["serialNo"])
        return res.status(422).json({ message: "Serial Number is required" });
      if (!data["category"])
        return res.status(422).json({ message: "Category is required" });

      const checkSerial = await checkSerialNo(data["serialNo"]);
      if (checkSerial !== "SUCCESS")
        return res.status(422).json({ message: checkSerial });

      data["code"] = await getCodeAndIncrement(data["category"], data["type"]);
      if (!data["code"])
        return res
          .status(422)
          .json({
            message: `Need to configure the index of ${data["type"]} - ${data["category"]}`,
          });

      const newAsset =
        data.type === "Hardware" ? new Hardware(data) : new Software(data);
      await newAsset.save();
      await auditAssets();

      return res.status(201).json(newAsset);
    } catch (error) {
      console.error("Error creating asset:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put(
  "/deploy/:code",
  [
    check("assignee")
      .optional()
      .isString()
      .withMessage("Assignee must be a string"),
  ],
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const { user } = req.cookies;

      const code: string = req.params.code;
      const data: any = req.body;

      if (data.code !== code) {
        return res.status(400).json({ message: "Asset code mismatch" });
      }

      const existingAsset = await Asset.findOne({ code });
      if (!existingAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      if (existingAsset.status === "Deployed") {
        return res
          .status(400)
          .json({ message: "This asset is already deployed" });
      }
      data.status = "Deployed";

      const currentUser = JSON.parse(user);
      data.updated = new Date();
      if (currentUser) {
        data.updatedBy = `${currentUser.firstName} ${currentUser.lastName}`;
      }

      const deploymentRecord = {
        deploymentDate: data.deploymentDate,
        assignee: data.assignee,
      };

      data.deploymentHistory = [
        ...existingAsset.deploymentHistory,
        deploymentRecord,
      ];

      await Asset.updateOne({ code: data.code }, data);
      const updatedAsset = await Asset.findOne({ code });

      await auditAssets();

      res.status(200).json(updatedAsset);
    } catch (error) {
      console.error("Error updating assets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put(
  "/retrieve/:code",
  [
    check("recoveredFrom")
      .optional()
      .isString()
      .withMessage("Recovered From must be a string"),
  ],
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const { user } = req.cookies;

      const code: string = req.params.code;
      const data: any = req.body;

      if (data.code !== code) {
        return res.status(400).json({ message: "Asset code mismatch" });
      }

      const existingAsset = await Asset.findOne({ code });
      if (!existingAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      if (existingAsset.status !== "Deployed") {
        return res.status(400).json({ message: "This asset is not deployed" });
      }

      const currentUser = JSON.parse(user);
      data.updated = new Date();
      if (currentUser) {
        data.updatedBy = `${currentUser.firstName} ${currentUser.lastName}`;
      }

      data.assignee = "";
      data.deploymentDate = null;

      const deploymentHistory = existingAsset.deploymentHistory;

      if (deploymentHistory.length > 0) {
        const lastDeploymentRecordIndex = deploymentHistory.length - 1;
        const lastDeploymentRecord =
          deploymentHistory[lastDeploymentRecordIndex];

        lastDeploymentRecord.recoveryDate = data.recoveryDate;
      } else {
        deploymentHistory.push({
          deploymentDate: existingAsset.deploymentDate,
          assignee: data.recoveredFrom,
          recoveryDate: data.recoveryDate,
        });
      }

      data.deploymentHistory = deploymentHistory;

      await Asset.updateOne({ code: data.code }, data);
      const updatedAsset = await Asset.findOne({ code });

      await auditAssets();
      res.status(200).json(updatedAsset);
    } catch (error) {
      console.error("Error updating assets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put(
  "/history/:code/:index",
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    try {
      const { code, index } = req.params;

      // Validate index
      const indexNumber = parseInt(index);
      if (isNaN(indexNumber)) {
        return res.status(400).json({ message: "Invalid index" });
      }

      // Find hardware asset
      const hardwareAsset: HardwareType | null = await Hardware.findOne({
        code: code,
      });
      if (!hardwareAsset) {
        return res.status(404).json({ message: "Hardware asset not found" });
      }

      // Check if index is within range
      if (
        indexNumber < 0 ||
        indexNumber >= hardwareAsset.deploymentHistory.length
      ) {
        return res.status(404).json({ message: "Index out of range" });
      }

      // Remove deployment history entry at index
      hardwareAsset.deploymentHistory.splice(indexNumber, 1);

      // Save hardware asset with updated deployment history
      await hardwareAsset.save();
      await auditAssets();

      res
        .status(200)
        .json({ message: "Deployment history entry removed successfully" });
    } catch (error) {
      console.error("Error removing deployment history entry:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put(
  "/:code",
  [
    check("type")
      .exists()
      .withMessage("Asset type is required")
      .isIn(["Hardware", "Software"])
      .withMessage("Invalid asset type"),
    check("brand").optional().isString().withMessage("Brand must be a string"),
    check("modelName")
      .optional()
      .isString()
      .withMessage("Model name must be a string"),
    check("modelNo")
      .optional()
      .isString()
      .withMessage("Model number must be a string"),
    check("serialNo")
      .optional()
      .isString()
      .withMessage("Serial number must be a string"),
    // Additional checks for hardware-specific properties
    check("status", "Asset status is required").custom((value, { req }) => {
      if (req.body.type === "Hardware") {
        return !!value;
      }
      return true;
    }),
    check("category", "Asset category is required").custom((value, { req }) => {
      if (req.body.type === "Hardware") {
        return !!value;
      }
      return true;
    }),
    check("processor")
      .optional()
      .isString()
      .withMessage("Processor must be a string"),
    check("memory")
      .optional()
      .isString()
      .withMessage("Memory must be a string"),
    check("storage")
      .optional()
      .isString()
      .withMessage("Storage must be a string"),
    check("assignee")
      .optional()
      .isString()
      .withMessage("Assignee must be a string"),
    check("purchaseDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid purchase date"),
    check("supplierVendor")
      .optional()
      .isString()
      .withMessage("Supplier vendor must be a string"),
    check("pezaForm8105")
      .optional()
      .isString()
      .withMessage("PEZA form 8105 must be a string"),
    check("pezaForm8106")
      .optional()
      .isString()
      .withMessage("PEZA form 8106 must be a string"),
    check("isRGE")
      .optional()
      .isBoolean()
      .withMessage("isRGE must be a boolean"),
    check("equipmentType", "Equipment type is required").custom(
      (value, { req }) => {
        if (req.body.type === "Hardware") {
          return !!value;
        }
        return true;
      }
    ),
    check("remarks")
      .optional()
      .isString()
      .withMessage("Remarks must be a string"),
    check("notifyRemarks")
      .optional()
      .isBoolean()
      .withMessage("Notify Remarks must be a boolean"),
    check("deploymentDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid deployment date"),
    check("recoveredFrom")
      .optional()
      .isString()
      .withMessage("Recovered from must be a string"),
    check("recoveryDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid recovery date"),
    // Additional checks for software-specific properties
    check("license")
      .optional()
      .isString()
      .withMessage("License must be a string"),
    check("version")
      .optional()
      .isString()
      .withMessage("Version must be a string"),
  ],
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const { user } = req.cookies;

      const code: string = req.params.code;
      const data: any = req.body;

      const existingAssetCode: any = await Asset.findOne({ code: data.code });
      if (existingAssetCode && existingAssetCode._id.toString() !== data._id) {
        return res.status(400).json({ message: "Asset code already exists" });
      }

      if (data["serialNo"]) {
        const checkSerial = await checkSerialNo(
          data["serialNo"],
          existingAssetCode._id.toString()
        );
        if (checkSerial !== "SUCCESS")
          return res.status(422).json({ message: checkSerial });
      }

      delete data._id;

      const existingAsset: any = await Asset.findOne({ code });

      if (!existingAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      const currentUser = JSON.parse(user);
      data.updated = new Date();
      if (currentUser) {
        data.updatedBy = `${currentUser.firstName} ${currentUser.lastName}`;
      }

      delete data["code"];

      let depHist = existingAsset["deploymentHistory"];
      if (!Array.isArray(depHist)) depHist = [];
      else depHist = depHist.reverse();

      const recoveryProcess = (
        assignee: string,
        recoveryDate?: Date,
        deploymentDate?: Date
      ) => {
        if (assignee) {
          const findIndex = depHist.findIndex((f: any) => {
            return f["assignee"] === assignee;
          });
          const recovery = {
            assignee,
            recoveryDate: recoveryDate ?? new Date(),
          };
          // Update recovery fields
          data.recoveredFrom = recovery.assignee;
          data.recoveryDate = recovery.recoveryDate;

          if (findIndex === 0)
            depHist[findIndex] = {
              ...depHist[findIndex].toObject(),
              ...recovery,
            };
          else {
            depHist.unshift({
              ...recovery,
              deploymentDate: deploymentDate ?? null,
            });
          }
        }
      };

      if (data["assignee"]) {
        // If 'Assignee' is filled in, deploy the asset to assignee
        data["status"] = "Deployed";
        if (data["assignee"] !== existingAsset["assignee"]) {
          // Recover asset from old assignee and deploy to new assignee
          recoveryProcess(
            existingAsset["assignee"],
            new Date(),
            existingAsset["deploymentDate"]
          );
          const deploy = {
            assignee: data["assignee"],
            deploymentDate: data["deploymentDate"]
              ? data["deploymentDate"]
              : new Date(),
          };
          depHist.unshift(deploy);
        }
      } else if (data["status"] === "Deployed" && !data["assignee"]) {
        // Recover asset from current assignee if 'Assignee' field is left blank and status is 'Deployed'
        data["status"] = "IT Storage";
        if (data["assignee"] !== existingAsset["assignee"]) {
          recoveryProcess(
            existingAsset["assignee"],
            new Date(),
            existingAsset["deploymentDate"]
          );
        }
      }

      const recoveredFrom = data["recoveredFrom"];
      const recoveryDate = data["recoveryDate"];
      if (
        existingAsset["status"] === "Deployed" &&
        existingAsset["status"] !== data["status"]
      ) {
        // Recover asset from current assignee if status is changed from 'Deployed'
        recoveryProcess(
          existingAsset["assignee"],
          new Date(),
          existingAsset["deploymentDate"]
        );
      }

      // If 'Recovered From' is filled in, recover asset from that assignee regardless of asset status
      if (recoveredFrom && recoveredFrom !== existingAsset["recoveredFrom"]) {
        recoveryProcess(recoveredFrom, recoveryDate);
      }

      depHist = depHist.reverse();

      if (depHist.length > 0) data["deploymentHistory"] = depHist;

      // Remove undefined date properties and set them to null
      data.deploymentDate ??= null;
      data.purchaseDate ??= null;
      data.recoveryDate ??= null;

      // Update the asset
      const updatedAsset =
        data.type === "Hardware"
          ? await Hardware.findOneAndUpdate({ code: code }, data, { new: true })
          : await Software.findOneAndUpdate({ code: code }, data, {
              new: true,
            });

      await auditAssets();

      res.status(200).json(updatedAsset);
    } catch (error) {
      console.error("Error updating asset:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { type, status, category, processor, memory, storage } = req.query;
    const allowedFilter = {
      type,
      status,
      category,
      processor,
      memory,
      storage,
    };

    const query = Object.fromEntries(
      Object.entries(allowedFilter).filter(
        ([, v]) => v !== undefined && v !== null && v !== ""
      )
    );

    const assets: any[] = await emplyeeSnapper(
      await Asset.aggregate().match(query)
    );

    res.status(200).json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get(
  "/count/:property?/:value?",
  verifyToken,
  async (req: Request, res: Response) => {
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
      console.error("Error fetching asset count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/uniqueValues/:property",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { property } = req.params;
      const query: any = {};

      const aggregationPipeline: any[] = [];

      // Add a $match stage to filter out null, undefined, and empty strings
      aggregationPipeline.push({
        $match: {
          [property]: {
            $ne: null, // Exclude null values
            $exists: true, // Exclude undefined values
            $not: { $eq: "" }, // Exclude empty strings
          },
        },
      });

      if (Object.keys(query).length === 0) {
        aggregationPipeline.push({
          $group: {
            _id: `$${property}`,
          },
        });
      } else {
        aggregationPipeline.push(
          {
            $match: query,
          },
          {
            $group: {
              _id: `$${property}`,
            },
          }
        );
      }

      const uniqueValues = await Asset.aggregate(aggregationPipeline);
      const values = uniqueValues.map((valueObj: any) => valueObj._id);

      res.status(200).json(values);
    } catch (error) {
      console.error("Error fetching assets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/:property/:value",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { property, value } = req.params;
      const query: any = {};

      query[property as string] = value ? value.trim() : "";

      const assets: any[] = await emplyeeSnapper(
        await Asset.aggregate().match(query)
      );

      res.status(200).json(assets);
    } catch (error) {
      console.error("Error fetching assets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put(
  "/:property/:value",
  [
    check("category")
      .optional()
      .isString()
      .withMessage("Category must be a string"),
    check("processor")
      .optional()
      .isString()
      .withMessage("Processor must be a string"),
    check("memory")
      .optional()
      .isString()
      .withMessage("Memory must be a string"),
    check("storage")
      .optional()
      .isString()
      .withMessage("Storage must be a string"),
    check("status")
      .optional()
      .isString()
      .withMessage("Status must be a string"),
    check("assignee")
      .optional()
      .isString()
      .withMessage("Assignee must be a string"),
    check("purchaseDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid purchase date"),
    check("supplierVendor")
      .optional()
      .isString()
      .withMessage("Supplier vendor must be a string"),
    check("pezaForm8105")
      .optional()
      .isString()
      .withMessage("PEZA form 8105 must be a string"),
    check("pezaForm8106")
      .optional()
      .isString()
      .withMessage("PEZA form 8106 must be a string"),
    check("isRGE")
      .optional()
      .isBoolean()
      .withMessage("isRGE must be a boolean"),
    check("equipmentType")
      .optional()
      .isString()
      .withMessage("Equipment type must be a string"),
    check("remarks")
      .optional()
      .isString()
      .withMessage("Remarks must be a string"),
    check("notifyRemarks")
      .optional()
      .isBoolean()
      .withMessage("Notify remarks must be a boolean"),
    check("deploymentDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid deployment date"),
    check("recoveredFrom")
      .optional()
      .isString()
      .withMessage("Recovered from must be a string"),
    check("recoveryDate")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid recovery date"),
  ],
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const { property, value } = req.params;
      const updateData: any = req.body;

      const updateDataKeys = Object.keys(updateData);
      if (updateDataKeys.length === 0) {
        return res
          .status(400)
          .json({ message: "Request body cannot be empty" });
      }
      if (property !== updateDataKeys[0]) {
        return res
          .status(400)
          .json({
            message: `Property '${property}' in URL must match property in request body`,
          });
      }

      const existingAssets = await Asset.find({ [property]: value });

      if (!existingAssets || existingAssets.length === 0) {
        return res
          .status(404)
          .json({ message: `No assets found with { ${property} : ${value} }` });
      }

      if (updateData["code"]) delete updateData["code"];

      await Hardware.updateMany({ [property]: value }, updateData);
      await auditAssets();
      res.status(200).json({ message: "Assets updated successfully" });
    } catch (error) {
      console.error("Error updating assets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/:code", verifyToken, async (req: Request, res: Response) => {
  try {
    const code: string = req.params.code;

    const asset = await Asset.findOne({ code });

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json(asset);
  } catch (error) {
    console.error("Error fetching asset:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete(
  "/:property/:value",
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    try {
      const { property, value } = req.params;
      const query: any = {};
      query[property] = value;

      const deletedAssets = await Asset.deleteMany(query);

      if (deletedAssets.deletedCount === 0) {
        return res.status(404).json({ message: "No assets found" });
      }

      await auditAssets();
      res.status(200).json({ message: "Assets deleted successfully" });
    } catch (error) {
      console.error("Error deleting assets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.delete(
  "/:code",
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    try {
      const code: string = req.params.code;
      const asset = await Asset.findOne({ code });

      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      await Asset.deleteOne({ code });
      await auditAssets();
      res.status(200).json({ message: "Asset deleted successfully" });
    } catch (error) {
      console.error("Error deleting asset:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.patch(
  "/bulkDelete",
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    try {
      const codesToDelete = req.body;

      if (!Array.isArray(codesToDelete))
        return res
          .status(422)
          .json({
            message: "Request body should be an array of Asset Item Codes",
          });
      if (codesToDelete.length === 0)
        return res
          .status(422)
          .json({ message: "Request body should not be an empty array" });

      await Asset.deleteMany({ code: { $in: codesToDelete } });
      await auditAssets();
      res.status(200).json({ message: "Assets deleted successfully" });
    } catch (error) {
      console.error("Error deleting assets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
