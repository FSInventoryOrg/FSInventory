import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs"
import User from "../models/user.schema";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

/**
 * @openapi
 * /api/auth/login:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Login to the system
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                example: john.doe@example.com
 *              password:
 *                type: string
 *                example: password123
 *    responses:
 *      200:
 *        description: Successfully logged in
 *      400:
 *        description: Invalid credentials
 *      500:
 *        description: Internal server error
 */
router.post("/login", [
    check("email", "Email is required").isString().isLength({ min:1, }).isEmail(),
    check("password", "Password is required").isLength({ min:1, }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array().map(error => error.msg).join('; ') });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { 
          userId: user.id,
          role: user.role
        }, 
        process.env.JWT_SECRET_KEY as string, 
        { expiresIn: "30d" },
      );
      
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000 * 30,
      })

      res.status(200).json({ userId: user._id })
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
)

/**
 * @openapi
 * /api/auth/validate-token:
 *  get:
 *    tags:
 *      - Auth
 *    summary: Validates authentication token
 *    responses:
 *      200:
 *        description: Token valid
 *      401:
 *        description: Unauthorized access
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Unauthorized access
 *    security:
 *      - bearerAuth: []
 */
router.get("/validate-token", verifyToken, (req: Request, res:Response) => {
  res.status(200).send({ userId: req.userId });
})

/**
 * @openapi
 * /api/auth/logout:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Logout from the system
 *    responses:
 *      200:
 *        description: Successfully logged out
 *      500:
 *        description: Internal server error
 */
router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
})

export default router;