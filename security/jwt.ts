import { NextFunction, Request, Response } from "express";
import { validPassword } from "../libs/passwordGen";
import { generateAccessToken } from "./GenToken";
import { client } from "../utils/connectDb";

const blog_post = client.db("blog_post");
const user = blog_post.collection("users");

interface opt {
	success?: string | null;
	failure?: string | null;
}

export function tokenAuthenticate(option: opt) {
	return loginToken(option.success, option.failure);
}
function loginToken(
	success: string | null = null,
	failure: string | null = null
) {
	return (req: Request, res: Response, next: NextFunction) => {
		const username = req.body.username;
		const pass = req.body.password;
		user
			.findOne({ username: username })
			.then((us: any) => {
				const valid = validPassword(pass, us.hash, us.salt);
				if (valid) {
					const accessToken = generateAccessToken(us);
					if (success) {
						res
							.cookie("usertoken", accessToken, {
								maxAge: 1000 * 60 * 60 * 24 * 2,
								httpOnly: true,
								secure: false, //https only
								sameSite: true, //same domain
							})
							.redirect(success);
						return next();
					}
				}
			})
			.catch((err) => {
				if (failure) {
					res.redirect(failure);
				} else {
					return res.send(err);
				}
			});
	};
}
