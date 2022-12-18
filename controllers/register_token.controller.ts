import { Request, Response, Router } from "express";
import passport from "passport";
import { genPassword } from "../libs/passwordGen";
import { client } from "../utils/connectDb";
const blog_post = client.db("blog_post");
const user = blog_post.collection("users_token");
type verify = {
	strategy: string | passport.Strategy | string[];
	option: passport.AuthenticateOptions;
};

export class registerTokenController {
	private _router = Router();

	constructor() {
		this.setRoutes();
	}

	public setRoutes() {
		this.router.get("/registertoken", (req: Request, res: Response) => {
			return res.render("register");
		});
		this.router.post("/registertoken", (req: Request, res: Response) => {
			const username = req.body.username;
			const password = req.body.password;
			const gen = genPassword(password);
			user
				.insertOne({ username: username, hash: gen.hash, salt: gen.salt })
				.then((val) => {
					if (val) {
						return res.render("login");
					} else {
						return res.send("register fail!!!");
					}
				});
		});
	}

	public get router() {
		return this._router;
	}
}
