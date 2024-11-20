import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import verifyToken, { verifyRole } from "../middleware/auth";
import Employee from "../models/employee.schema";
import { EmployeeType } from "../models/employee.schema";
import Asset from "../models/asset.schema";
import Hardware from "../models/hardware.schema";

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const employees: EmployeeType[] = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get(
  "/includeUnregistered",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const employees: EmployeeType[] = await Employee.find();
      const assetAssigneeUsers: string[] = await Asset.distinct("assignee");
      const assetRecoveredUsers: string[] =
        await Asset.distinct("recoveredFrom");
      const assetUsers = assetAssigneeUsers
        .concat(assetRecoveredUsers)
        .sort()
        .reduce((accum: any[], value: any) => {
          value = value ? value.trim() : "";

          if (value) {
            const findIndex = accum.findIndex((f) => f["code"] === value);
            if (findIndex === -1) {
              const findEmployeeIndex = employees.findIndex((f) => {
                let name = `${f["firstName"]}`;
                if (f["middleName"]) name += ` ${f["middleName"]}`;
                name += ` ${f["lastName"]}`;

                return f["code"] === value || name === value;
              });

              if (findEmployeeIndex === -1)
                accum.push({
                  code: value,
                  state: "UNREGISTERED",
                  firstName: "",
                  lastName: "",
                });
            }
          }

          return accum;
        }, []);

      const newEmployees = employees.concat(assetUsers);
      res.status(200).json(newEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/:code", verifyToken, async (req: Request, res: Response) => {
  const { code } = req.params;
  try {
    const employee: EmployeeType | null = await Employee.findOne({ code });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

      const uniqueValues = await Employee.aggregate(aggregationPipeline);
      const values = uniqueValues.map((valueObj: any) => valueObj._id);

      res.status(200).json(values);
    } catch (error) {
      console.error("Error fetching assets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/",
  [
    check("code").isString().withMessage("Employee code must be a string"),
    check("firstName").isString().withMessage("First name must be a string"),
    check("lastName").isString().withMessage("Last name must be a string"),
    check("position").isString().withMessage("Position must be a string"),
    check("firstName").isString().withMessage("First name must be a string"),
    check("startDate").isISO8601().toDate().withMessage("Invalid start date"),
  ],
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const data: any = req.body;

      const existingEmployee = await Employee.findOne({ code: data.code });
      if (existingEmployee) {
        return res
          .status(400)
          .json({ message: "Employee code already exists" });
      }

      const employee = new Employee(req.body);
      employee.isRegistered = true;
      await employee.save();
      res.status(201).json(employee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put(
  "/history/:code/:index",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { code, index } = req.params;

      // Validate index
      const indexNumber = parseInt(index);
      if (isNaN(indexNumber)) {
        return res.status(400).json({ message: "Invalid index" });
      }

      // Find employee
      const employee = await Employee.findOne({ code });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Check if index is within range
      if (indexNumber < 0 || indexNumber >= employee.assetsHistory.length) {
        return res.status(404).json({ message: "Index out of range" });
      }

      // Remove asset history entry at index
      employee.assetsHistory.splice(indexNumber, 1);

      // Save employee with updated assets history
      await employee.save();

      res
        .status(200)
        .json({ message: "Asset history entry removed successfully" });
    } catch (error) {
      console.error("Error removing asset history entry:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put(
  "/history/:code",
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const code: string = req.params.code;
      const data: any = req.body;

      const existingEmployee = await Employee.findOne({ code });

      if (!existingEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      const assetsHistory = existingEmployee.assetsHistory;

      assetsHistory.push({
        deploymentDate: data.recoveryDate,
        assetCode: data.assetCode,
        recoveryDate: data.recoveryDate,
      });

      data.assetsHistory = assetsHistory;

      await Employee.updateOne({ code: code }, data);
      const updatedEmployee = await Employee.findOne({ code });

      res.status(200).json(updatedEmployee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put(
  "/:code",
  [
    check("code").isString().withMessage("Employee code must be a string"),
    check("firstName").isString().withMessage("First name must be a string"),
    check("lastName").isString().withMessage("Last name must be a string"),
    check("position").isString().withMessage("Position must be a string"),
    check("firstName").isString().withMessage("First name must be a string"),
    check("startDate").isISO8601().toDate().withMessage("Invalid start date"),
  ],
  verifyToken,
  verifyRole,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const code: string = req.params.code;
      const data: any = req.body;

      const existingEmployeeCode = await Employee.findOne({ code: data.code });
      if (
        existingEmployeeCode &&
        existingEmployeeCode._id.toString() !== data._id
      ) {
        return res
          .status(400)
          .json({ message: "Employee code already exists" });
      }
      delete data._id;

      const existingEmployee = await Employee.findOne({ code });

      if (!existingEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      data.isRegistered = true;
      await Employee.updateOne({ code: code }, data);
      const updatedEmployee = await Employee.findOne({ code });

      if (code !== data?.code) {
        const findDeploymentHistory: any = await Asset.aggregate().match({
          $or: [
            {
              deploymentHistory: {
                $exists: true,
                $not: {
                  $size: 0,
                },
                $elemMatch: {
                  assignee: code,
                },
              },
            },
            {
              assignee: code,
            },
            {
              recoveredFrom: code,
            },
          ],
        });

        if (findDeploymentHistory.length > 0) {
          findDeploymentHistory.forEach(async (history: any) => {
            const assetData: any = {};
            const newData: any[] = [];

            history.deploymentHistory.forEach((deployed: any) => {
              if (deployed.assignee === code) deployed.assignee = data.code;
              newData.push(deployed);
            });

            assetData["deploymentHistory"] = newData;
            if (history["assignee"] === code) assetData["assignee"] = data.code;
            if (history["recoveredFrom"] === code)
              assetData["recoveredFrom"] = data.code;

            await Hardware.updateOne({ _id: history["_id"] }, assetData);
          });
        }
      }

      res.status(200).json(updatedEmployee);
    } catch (error) {
      console.error("Error updating employee:", error);
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

      const deletedEmployee: EmployeeType | null =
        await Employee.findOneAndDelete({ code });
      if (!deletedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
