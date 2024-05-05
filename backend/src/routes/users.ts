import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import User from '../models/user.schema';
import { UserType } from '../models/user.schema';
import { check, validationResult } from 'express-validator'
import verifyToken from '../middleware/auth';

const router = express.Router();

/**
 * @openapi
 * /api/users/register:
 *  post:
 *    tags:
 *      - User
 *    summary: Registers a new user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: User registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User' 
 *      400:
 *        description: Invalid request body or email address already registered
 *      500:
 *        description: Internal server error
 */
router.post("/register", [ 
    check("email", "Email is required").isEmail(),
    check("password", "Password with 8 or more characters required").isLength({ min: 8 }),
    check("firstName", "First name is required").isString(),
    check("lastName", "Last name is required").isString(),
    check("role", "Role is required").isString(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() })
    }
    try {
      let user = await User.findOne({
        email: req.body.email,
      })

      if (user) {
        return res.status(400).json({ message: "Email address already registered." });
      }

      user = new User(req.body);
      user.joinDate = new Date();
      await user.save();

      const token = jwt.sign(
        { 
          userId: user.id,
          role: user.role
        }, 
        process.env.JWT_SECRET_KEY as string, 
        { expiresIn: "1d" }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      })

      return res.status(200).send({ message: "User registered successfully" });

    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
)

/**
 * @openapi
 * /api/users:
 *  get:
 *    tags:
 *      - User
 *    summary: Get current user details via auth_token in cookies
 *    responses:
 *      200:
 *        description: User found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: User not found
 *      500:
 *        description: Internal server error
 *    security:
 *      - bearerAuth: []
 */
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const token = req.cookies.auth_token;
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    const userId = decodedToken.userId;

    const user: UserType | null = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;