import express, { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import User from '../models/user.schema';
import { UserType } from '../models/user.schema';
import { check, validationResult } from 'express-validator'
import verifyToken from '../middleware/auth';
import { tokenStatus } from '../utils/rocks';
import OTPTransaction from '../models/otptransactions.schema';
import { compareHash, generateHash, generateOTP, generateRandom6Digits } from '../utils/common';
import { sendMail } from '../system/mailer';

const router = express.Router();

router.post("/register", [
  check("email", "Email is required").isEmail(),
  check("password", "Password with 8 or more characters required").isLength({ min: 8 }),
  check("firstName", "First name is required").isString(),
  check("lastName", "Last name is required").isString(),
  check("role", "Role is required").isString(),
],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const { auth_token: token } = req.cookies;
    await tokenStatus(token);
    const response: any = await fetch(`${process.env.ROCKS_DEV_API_URL}/users/me`, {
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const user = await response.json()
    if (!user.data) {
      return res.status(404).json({ message: "Id not found" });
    }

    return res.status(200).json(user.data);

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.put("/", verifyToken, async (req: Request, res: Response) => {
  const { auth_token: token } = req.cookies;
  const decodedToken: any = await fetch(`${process.env.ROCKS_DEV_API_URL}/auth/check`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
  });
  const userId = decodedToken.userId;
  const updatedUser: UserType = req.body;

  try {
    const existingUser = await User.findOneAndUpdate(
      { _id: userId }, updatedUser)
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(existingUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post('/forgotPassword', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(422).json({ message: "User email is required to proceed with resetting the password" });

    const user: any = await User.findOne({ email: email });

    if (!user) return res.status(404).json({ message: "User email could not be found" });

    const { otp, expiration } = await generateOTP(email, "Resetting password", generateRandom6Digits());

    await sendMail({
      subject: 'FS IMS Account - Password Reset Confirmation',
      htmlMessage: `Hi ${user['firstName']}, please use this OTP <strong style="font-size: 18px !important;">${otp}</strong> to reset your password`,
      recipient: [email]
    })

    return res.status(200).json({ message: `OTP has been sent to your email and will expire on ${expiration.toLocaleString()}` })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
})

router.patch('/resetPassword', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const dateNow = new Date()

    if (!token) return res.status(422).json({ message: "Token is required to proceed with resetting the password" });
    if (!newPassword) return res.status(422).json({ message: "New Password is required to proceed with resetting the password" });

    const arrayOTPT: any = await OTPTransaction.aggregate().match({
      $expr: {
        $and: [
          {
            $eq: ['$otp', token]
          },
          {
            $gt: ['$expirationDate', { $toDate: dateNow }]
          }
        ]
      }
    });

    if (arrayOTPT.length > 1) return res.status(404).json({ message: "Not a valid OTP transaction" });
    else if (arrayOTPT.length === 0) return res.status(404).json({ message: "Token is expired. Cannot reset password." });

    const OTPT = arrayOTPT[0];

    const user: any = await User.findOne({ email: OTPT.email }).select("+password")

    if (!user) res.status(404).json({ message: "User not found" });

    const isMatchNew = await compareHash(user.password, newPassword);

    if (isMatchNew) return res.status(404).json({ message: "New password is same with the original password" });

    await OTPTransaction.updateOne({ _id: OTPT._id }, { status: 'USED' })

    const hashedPass = await generateHash(newPassword);
    await User.updateOne({ _id: user._id }, { password: hashedPass });

    const newAuthToken = jwt.sign(
      {
        userId: user.id,
        role: user.role
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", newAuthToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    })

    return res.status(200).send({ message: "You have changed your password successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
})

router.patch('/changePassword', verifyToken, async (req: Request, res: Response) => {
  try {
    const { auth_token: token } = req.cookies;
    const decodedToken: any = await fetch(`${process.env.ROCKS_DEV_API_URL}/auth/check`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
    });
    const userId = decodedToken.userId;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword) return res.status(422).json({ message: "Current Password is required to proceed with resetting the password" });
    if (!newPassword) return res.status(422).json({ message: "New Password is required to proceed with resetting the password" });

    const user: any = await User.findOne({ _id: userId }).select("+password")

    if (!user) res.status(404).json({ message: "User not found" });

    const isMatchCurrent = await compareHash(user.password, currentPassword);
    const isMatchNew = await compareHash(user.password, newPassword);

    if (!isMatchCurrent) return res.status(404).json({ message: "Current password does not match the original password" });
    if (isMatchNew) return res.status(404).json({ message: "New password is same with the original password" });

    const hashedPass = await generateHash(newPassword);
    await User.updateOne({ _id: user._id }, { password: hashedPass });

    return res.status(200).send({ message: "You have changed your password successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
})

export default router;