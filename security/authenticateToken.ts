import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const token = req.cookies.usertoken;
	if (token && process.env.ACCESS_TOKEN_SECRET) {
		jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET,
			(err: any, user: any) => {
				if (err) return res.sendStatus(401).render("login_token");
				return next();
			}
		);
	} else {
		return res.status(401).render("login_token");
	}
}
