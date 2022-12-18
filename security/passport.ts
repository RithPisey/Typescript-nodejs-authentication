import passport from "passport";
import { local_authentication } from "./local_authentication";
import { ObjectId } from "mongodb";
import { client } from "../utils/connectDb";
import { userLog } from "../Interfaces/userLog";
const blog_post = client.db("blog_post");
const user = blog_post.collection("users");

passport.use(new local_authentication().strategy);
passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((userlogin: userLog, done) => {
	user.findOne({ _id: new ObjectId(userlogin._id) }).then((us) => {
		if (us) {
			done(null, us);
		} else {
			done("somethings errors!!!");
		}
	});
});

const initialize_passport = passport.initialize();
const session_passport = passport.session();
const verifyUser = (
	strategy: string | passport.Strategy | string[],
	option: passport.AuthenticateOptions
) => {
	return passport.authenticate(strategy, option);
};

export { initialize_passport, session_passport, verifyUser };
