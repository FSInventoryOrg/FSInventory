import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import verifyToken, { IT_MANAGER } from "../middleware/auth";

const router = express.Router();

const {
  NODE_ENV,
  ROCKS_PRODUCTION_API_URL,
  ROCKS_DEV_API_URL,
  ROCKS_CLIENT_ID: client_id,
  ROCKS_CLIENT_SECRET: client_secret,
  ROCKS_GRANT_SCOPE: grant_scope,
} = process.env;

const API_URL: string =
  NODE_ENV === "PRODUCTION" ? ROCKS_PRODUCTION_API_URL! : ROCKS_DEV_API_URL!;

router.post(
  "/login",
  [
    check("email", "Email is required").isString().isLength({ min: 1 }),
    check("password", "Password is required").isLength({ min: 1 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors
          .array()
          .map((error) => error.msg)
          .join("; "),
      });
    }

    const { email: username, password } = req.body;

    try {
      const bodyToSend = {
        username,
        password,
        client_id,
        client_secret,
        grant_scope,
        grant_type: "password",
      };

      const response = await fetch(`${API_URL}/auth/token`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyToSend),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new Error(responseBody.message);
      }

      const { access_token: token, user_details } = responseBody;
      const {
        first_name,
        last_name,
        employee_no,
        role_name: role,
        managers,
      } = user_details;
      const is_admin: boolean = username === IT_MANAGER;

      const rocks_user = await fetch(
        `${API_URL}/employees?employeeNo=${employee_no}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!rocks_user.ok) {
        throw new Error(responseBody.message);
      }

      const userBody = await rocks_user.json();

      const { avatar } = userBody.data[0];

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      res.cookie(
        "user",
        JSON.stringify({
          first_name,
          last_name,
          is_admin,
          email: username,
          avatar,
          role,
          manager: managers[0],
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 86400000,
        }
      );
      res
        .status(200)
        .json({ user: { ...user_details, is_admin, email: username, avatar } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.user.userId });
});

router.post("/logout", async (req: Request, res: Response) => {
  const token = req.cookies["auth_token"];
  await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.cookie("user", "", {
    expires: new Date(0),
  });
  res.send();
});

router.get("/cookie-user", (req: Request, res: Response) => {
  const { user, auth_token } = req.cookies;

  if (!auth_token) res.status(401).json({ message: "Unauthorized" });

  if (!user) res.status(401).json({ message: "Unauthorized" });

  res.status(200).json({ user: JSON.parse(user), isLoggedIn: !!auth_token });
});

export default router;
