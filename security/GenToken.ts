import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export function generateAccessToken(user: object) {
	const secret = process.env.ACCESS_TOKEN_SECRET;
	if (secret) {
		return jwt.sign(user, secret, {
			expiresIn: "1d",
		});
	} else {
		return null;
	}
}
