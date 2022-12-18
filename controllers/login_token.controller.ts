import { Request, Response, Router } from "express";
import passport from "passport";
import { userLog } from "../Interfaces/userLog";
import { validPassword } from "../libs/passwordGen";
import { isAuthenticated } from "../security/check_authentication";
import { generateAccessToken } from "../security/GenToken";
import { tokenAuthenticate } from "../security/jwt";
import { client } from "../utils/connectDb";

const blog_post = client.db("blog_post");
const user = blog_post.collection("users");

type verify = {
	strategy: string | passport.Strategy | string[];
	option: passport.AuthenticateOptions;
};

export class LoginTokenController {
	private _router = Router();

	constructor(verifyUser: any) {
		this.setRoutes(verifyUser);
	}

	public setRoutes(verifyUser: any) {
		this.router.get("/loginToken", (req: Request, res: Response) => {
			return res.render("login_token");
		});
		this.router.post(
			"/loginToken",
			tokenAuthenticate({ success: "profileToken" })
		);
		this.router.get("/logoutToken", (req: Request, res: Response) => {
			res.clearCookie("usertoken").redirect("/");
		});
	}

	public get router() {
		return this._router;
	}
}
