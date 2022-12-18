import passport from "passport";
import localStrategy from "passport-local";
import { validPassword } from "../libs/passwordGen";
import { client } from "../utils/connectDb";
const blog_post = client.db("blog_post");
const user = blog_post.collection("users");

class local_authentication {
	private _strategy: passport.Strategy;
	constructor() {
		this._strategy = new localStrategy.Strategy((username, password, done) => {
			user
				.findOne({ username: username })
				.then((us): any => {
					if (us) {
						const isValid = validPassword(password, us.hash, us.salt);
						if (isValid) {
							return done(null, us);
						} else {
							return done("Wrong Password!", false);
						}
					} else {
						done("Wrong Username!");
					}
				})
				.catch((err) => {
					done(err);
				});
		});
	}
	public get strategy(): passport.Strategy {
		return this._strategy;
	}
}

export { local_authentication };
