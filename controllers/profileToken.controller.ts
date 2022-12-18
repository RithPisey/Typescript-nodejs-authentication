import { Request, Response, Router } from "express";
import { authenticateToken } from "../security/authenticateToken";
import { isAuthenticated } from "../security/check_authentication";

export class ProfileTokenController {
	private _router = Router();

	constructor() {
		this.setRoutes();
	}

	public setRoutes() {
		this.router.get(
			"/profileToken",
			authenticateToken,
			(req: Request, res: Response) => {
				return res.render("profileToken");
			}
		);
	}

	public get router() {
		return this._router;
	}
}
