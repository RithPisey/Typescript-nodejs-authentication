import { Request, Response, Router } from "express";

export class HomeController {
	private _router = Router();

	constructor() {
		this.setRoutes();
	}

	public setRoutes() {
		this.router.get("/", (req: Request, res: Response) => {
			return res.render("home");
		});
	}

	public get router() {
		return this._router;
	}
}
