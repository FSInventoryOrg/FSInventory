import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import verifyToken from '../middleware/auth';
import jwt from "jsonwebtoken";
import Employee, { AssetsHistory } from '../models/employee.schema';
import { EmployeeType } from '../models/employee.schema';

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const employees: EmployeeType[] = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get("/:code", async (req: Request, res: Response) => {
  const { code } = req.params;
  try {
    const employee: EmployeeType | null = await Employee.findOne({ code });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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

    const uniqueValues = await Employee.aggregate(aggregationPipeline);
    const values = uniqueValues.map((valueObj: any) => valueObj._id);

    res.status(200).json(values);

  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @openapi
 * /api/employees:
 *  post:
 *    tags:
 *      - Employee
 *    summary: Create a new employee
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EmployeeType'
 *    responses:
 *      201:
 *        description: Employee created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EmployeeType'
 *      400:
 *        description: Bad request, validation errors
 *      500:
 *        description: Internal Server Error
 *    security:
 *      - bearerAuth: []
 */
router.post("/", [
    check("code").isString().withMessage("Employee code must be a string"),
    check("firstName").isString().withMessage("First name must be a string"),
    check("lastName").isString().withMessage("Last name must be a string"),
    check("position").isString().withMessage("Position must be a string"),
    check("firstName").isString().withMessage("First name must be a string"),
    check("startDate").isISO8601().toDate().withMessage("Invalid start date"),
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

      const data: any = req.body;

      const existingEmployee = await Employee.findOne({ code: data.code });
      if (existingEmployee) {
        return res.status(400).json({ message: "Employee code already exists" });
      }

      const employee = new Employee(req.body);
      employee.isRegistered = true;
      await employee.save();
      res.status(201).json(employee);
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

/**
 * @openapi
 * /api/employees/history/{code}/{index}:
 *  put:
 *    tags:
 *      - Employee
 *    summary: Remove an asset history entry for an employee by code and index
 *    parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        schema:
 *          type: string
 *        description: Employee code
 *      - in: path
 *        name: index
 *        required: true
 *        schema:
 *          type: integer
 *        description: Index of the asset history entry to remove
 *    responses:
 *      200:
 *        description: Asset history entry removed successfully
 *      400:
 *        description: Bad request, validation errors
 *      404:
 *        description: Employee not found or index out of range
 *      500:
 *        description: Internal Server Error
 *    security:
 *      - bearerAuth: []
 */
router.put("/history/:code/:index", verifyToken, async (req: Request, res: Response) => {
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

    res.status(200).json({ message: "Asset history entry removed successfully" });
  } catch (error) {
    console.error('Error removing asset history entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @openapi
 * /api/employees/history/{code}:
 *  put:
 *    tags:
 *      - Employee
 *    summary: Update an existing employee
 *    parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        schema:
 *          type: string
 *        description: Employee code
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EmployeeType'
 *    responses:
 *      200:
 *        description: Employee updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EmployeeType'
 *      400:
 *        description: Bad request, validation errors
 *      404:
 *        description: Employee not found
 *      500:
 *        description: Internal Server Error
 *    security:
 *      - bearerAuth: []
 */
router.put("/history/:code",
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

        const existingEmployee = await Employee.findOne({ code });

        if (!existingEmployee) {
          return res.status(404).json({ message: 'Employee not found' });
        }

        const assetsHistory = existingEmployee.assetsHistory;

        assetsHistory.push({
          deploymentDate: data.recoveryDate,
          assetCode: data.assetCode,
          recoveryDate: data.recoveryDate,
        });

        data.assetsHistory = assetsHistory;

        let updatedEmployee;
        await Employee.updateOne({ code: code }, data);
        updatedEmployee = await Employee.findOne({ code });      
        
        res.status(200).json(updatedEmployee);
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);


/**
 * @openapi
 * /api/employees/{code}:
 *  put:
 *    tags:
 *      - Employee
 *    summary: Update an existing employee
 *    parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        schema:
 *          type: string
 *        description: Employee code
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EmployeeType'
 *    responses:
 *      200:
 *        description: Employee updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EmployeeType'
 *      400:
 *        description: Bad request, validation errors
 *      404:
 *        description: Employee not found
 *      500:
 *        description: Internal Server Error
 *    security:
 *      - bearerAuth: []
 */
router.put("/:code", [
    check("code").isString().withMessage("Employee code must be a string"),
    check("firstName").isString().withMessage("First name must be a string"),
    check("lastName").isString().withMessage("Last name must be a string"),
    check("position").isString().withMessage("Position must be a string"),
    check("firstName").isString().withMessage("First name must be a string"),
    check("startDate").isISO8601().toDate().withMessage("Invalid start date"),
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

        const existingEmployeeCode = await Employee.findOne({ code: data.code });
        if (existingEmployeeCode && existingEmployeeCode._id.toString() !== data._id) {
          return res.status(400).json({ message: "Employee code already exists" });
        }
        delete data._id;

        const existingEmployee = await Employee.findOne({ code });

        if (!existingEmployee) {
          return res.status(404).json({ message: 'Employee not found' });
        }

        let updatedEmployee;
        data.isRegistered = true;
        await Employee.updateOne({ code: code }, data);
        updatedEmployee = await Employee.findOne({ code });
        
        res.status(200).json(updatedEmployee);
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

/**
 * @openapi
 * /api/employees/{code}:
 *  delete:
 *    tags:
 *      - Employee
 *    summary: Delete an employee by code
 *    parameters:
 *      - in: path
 *        name: code
 *        required: true
 *        schema:
 *          type: string
 *        description: Employee code
 *    responses:
 *      200:
 *        description: Employee deleted successfully
 *      403:
 *        description: Only users with admin role can perform this action
 *      404:
 *        description: Employee not found
 *      500:
 *        description: Internal Server Error
 *    security:
 *      - bearerAuth: []
 */
router.delete("/:code", verifyToken, async (req: Request, res: Response) => {
  try {
    const token = req.cookies.auth_token;
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    if (decodedToken.role !== "ADMIN") {
      return res.status(403).json({ message: "Only users with admin role can perform this action" });
    }

    const code: string = req.params.code;

    const deletedEmployee: EmployeeType | null = await Employee.findOneAndDelete({ code });
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
