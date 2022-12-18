import { Request, Response, Router } from "express";
import { isAuthenticated } from "../security/check_authentication";

export class ProfileController {
	private _router = Router();

	constructor() {
		this.setRoutes();
	}

	public setRoutes() {
		this.router.get(
			"/profile",
			isAuthenticated,
			(req: Request, res: Response) => {
				return res.render("profile");
			}
		);
	}

	public get router() {
		return this._router;
	}
}
