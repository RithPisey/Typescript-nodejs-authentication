import { Request, Response, Router } from "express";
import passport from "passport";
import { isAuthenticated } from "../security/check_authentication";

type verify = {
	strategy: string | passport.Strategy | string[];
	option: passport.AuthenticateOptions;
};

export class LoginController {
	private _router = Router();

	constructor(verifyUser: any) {
		this.setRoutes(verifyUser);
	}

	public setRoutes(verifyUser: any) {
		this.router.get("/login", (req: Request, res: Response) => {
			return res.render("login");
		});
		this.router.get("/logout", (req, res) => {
			req.logout({ keepSessionInfo: false }, (err) => {
				console.log(err);
			});
			res.redirect("/");
			return;
		});
		this.router.post(
			"/login",
			verifyUser("local", {
				successRedirect: "/profile",
				failureRedirect: "/",
			})
		);
	}

	public get router() {
		return this._router;
	}
}
