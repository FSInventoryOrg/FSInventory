import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user.schema";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import { compareHash, fetchExternalSource, generateRandom6Digits } from "../utils/common";
import OAuth from "../models/oauth.schema";
import Option from "../models/options.schema";

const router = express.Router();

const {
	ROCKS_DEV_API_URL,
	ROCKS_CLIENT_ID: client_id,
	ROCKS_CLIENT_SECRET: client_secret,
	ROCKS_GRANT_SCOPE: grant_scope
} = process.env

router.post("/login", [
	check("email", "Email is required").isString().isLength({ min: 1, }),
	check("password", "Password is required").isLength({ min: 1, }),
],
	async (req: Request, res: Response) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ message: errors.array().map(error => error.msg).join('; ') });
		}

		const { email: username, password } = req.body;

		try {
			const bodyToSend = {
				username,
				password,
				client_id,
				client_secret,
				grant_scope,
				grant_type: 'password'
			}

			const response = await fetch(`${ROCKS_DEV_API_URL}/auth/token`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(bodyToSend)
			})

			const responseBody = await response.json();

			if (!response.ok) {
				throw new Error(responseBody.message)
			}

			const { access_token: token, user_details } = responseBody;

			res.cookie("auth_token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				maxAge: 86400000,
			});
			res.status(200).json({ userId: user_details.user_id })
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}
	}
)

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
	res.status(200).send({ userId: req.user.userId });
})

router.post("/logout", (req: Request, res: Response) => {
	res.cookie("auth_token", "", {
		expires: new Date(0),
	});
	res.send();
})


router.post("/addAdmins", verifyToken, async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ message: errors.array() })
	}
	try {
		const token = req.cookies.auth_token;
		const decodedToken: any = await fetch(`${process.env.ROCKS_DEV_API_URL}/auth/check`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
		});

		if (false) { // TODO: UPDATE WHEN ROCKS API IS UPDATED WITH USER ROLES
			return res.status(403).json({ message: "Only users with admin role can perform this action" });
		}
		const data: any = req.body;

		if (!Array.isArray(data)) return res.status(422).json({ message: "Body should be an array" });
		const options = await Option.findOne();

		if (options) await Option.updateOne({ _id: options['_id'] }, { adminLists: data })

		return res.status(200).json({ message: "Admin list successfully updated" });
	} catch (error) {
		console.error('Error creating oauth credentials:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
})

router.post("/addOAuthCredentials", verifyToken, async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ message: errors.array() })
	}
	try {
		const token = req.cookies.auth_token;
		const decodedToken: any = await fetch(`${process.env.ROCKS_DEV_API_URL}/auth/check`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
		});

		if (false) { // TODO: UPDATE WHEN ROCKS API IS UPDATED WITH USER ROLES
			return res.status(403).json({ message: "Only users with admin role can perform this action" });
		}

		const currentUser = await User.findOne({ _id: decodedToken.userId });

		const data: any = req.body;

		if (!data.url) return res.status(422).json({ message: "URL is required to proceed" });
		if (!data.clientID) return res.status(422).json({ message: "Client ID is required to proceed" });
		if (!data.clientSecret) return res.status(422).json({ message: "Client Secret is required to proceed" });
		if (!data.scopes) return res.status(422).json({ message: "Scopes is required to proceed" });

		const currentDate = new Date();

		data.created = currentDate;
		data.updated = currentDate;

		if (currentUser) {
			data.createdBy = `${currentUser.firstName} ${currentUser.lastName}`;
			data.updatedBy = `${currentUser.firstName} ${currentUser.lastName}`;
		}

		const oauthData: any = await OAuth.findOne({ url: data.url });

		if (oauthData) {
			delete data['_id']
			await OAuth.updateOne({ _id: oauthData['_id'] }, data)
		} else {
			const newOAuth = new OAuth(data);
			await newOAuth.save()
		}

		return res.status(200).json({ message: "OAuth credentials successfully added" });
	} catch (error) {
		console.error('Error creating oauth credentials:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
})

router.get('/oauthLogin', async (req: Request, res: Response) => {
	try {
		const redirectURL = req.headers?.referer?.split('?')[0];
		const oauthCreds: any = await OAuth.findOne({ url: redirectURL });

		if (!oauthCreds) return res.status(401).json({ message: "Could not locate the OAuth credentials" });

		const responseURL = `https://accounts.zoho.com/oauth/v2/auth?scope=${oauthCreds['scopes'].toString().replace(/ /g, '')}&client_id=${oauthCreds['clientID']}&state=login&response_type=code&redirect_uri=${redirectURL}&access_type=offline`
		res.status(200).send({ url: responseURL });

	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
})

router.post('/verifyOAuthCode', async (req: Request, res: Response) => {
	try {
		const { code } = req.body;
		const redirectURL = req.headers?.referer?.split('?')[0];
		const oauthCreds: any = await OAuth.findOne({ url: redirectURL });

		if (!oauthCreds) return res.status(401).json({ message: "Could not locate the OAuth credentials" });

		const responseURL = `https://accounts.zoho.com/oauth/v2/token?code=${code}&client_id=${oauthCreds['clientID']}&client_secret=${oauthCreds['clientSecret']}&redirect_uri=${redirectURL}&grant_type=authorization_code`;
		const getOAuthToken: any = await fetchExternalSource(responseURL, { method: 'POST' })

		if (!getOAuthToken?.access_token) return res.status(401).json({ message: "OAuth verification fails" });

		const oauthUserInfo = `https://accounts.zoho.com/oauth/user/info`;

		const getOAuthUserInfo: any = await fetchExternalSource(oauthUserInfo, { headers: { 'Authorization': `Zoho-oauthtoken ${getOAuthToken.access_token}` } })

		if (!getOAuthUserInfo?.Email) return res.status(401).json({ message: "Could not read the information of OAuth user" });

		let user = await User.findOne({ email: getOAuthUserInfo.Email })

		if (!user) {
			const adminList: any = await Option.findOne();
			let isAdmin = false;

			if (Array.isArray(adminList?.adminLists)) isAdmin = adminList.adminLists.includes(getOAuthUserInfo.Email);

			const newUser = {
				firstName: getOAuthUserInfo.First_Name,
				lastName: getOAuthUserInfo.Last_Name,
				email: getOAuthUserInfo.Email,
				role: isAdmin ? "ADMIN" : "USER",
				joinDate: new Date(),
				password: generateRandom6Digits()
			}

			user = new User(newUser);
			await user.save()
		}

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

		return res.status(200).send({ message: "OAuth login successful", redirect: redirectURL });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Something went wrong" });
	}
})

export default router;