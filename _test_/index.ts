import express from "express";
import { client, uri } from "../utils/connectDb";
import passport from "passport";
import localStrategy from "passport-local";
import session from "express-session";
import crypto from "crypto";
import cookiesParser from "cookie-parser";
import MongoStore from "connect-mongo";
import { ObjectId } from "mongodb";

const blog_post = client.db("blog_post");
const users = blog_post.collection("users");
const app = express();
app.use(express.static("public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser());
app.use(
	session({
		secret: ["any long secret key"],
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 14,
			httpOnly: true,
			secure: false, //set to true in production
		},
		store: MongoStore.create({
			mongoUrl: uri + "/blog_post ",
			collectionName: "sessions",
			autoRemove: "interval",
			autoRemoveInterval: 60 * 24 * 14,
		}), //default store in MemoryStore
	})
);

interface pass {
	salt: string;
	hash: string;
}

function genPassword(password: string): pass {
	let salt = crypto.randomBytes(32).toString("hex");
	let genHash = crypto
		.pbkdf2Sync(password, salt, 10000, 64, "sha512")
		.toString("hex");
	return {
		salt: salt,
		hash: genHash,
	};
}
function validPassword(password: string, hash: string, salt: string): boolean {
	let hashVerify = crypto
		.pbkdf2Sync(password, salt, 10000, 64, "sha512")
		.toString("hex");
	return hash === hashVerify;
}

const strategy = new localStrategy.Strategy((username, password, done) => {
	users
		.findOne({ username: username })
		.then((user) => {
			if (!user) return done("Not User!", false);
			const isValid = validPassword(password, user.hash, user.salt);
			if (isValid) {
				return done(null, user);
			} else {
				return done("wrong password!", false);
			}
		})
		.catch((err) => done(err));
});

passport.use(strategy);

passport.serializeUser((user, done) => {
	done(null, user);
});

interface userLog {
	_id: string;
	username: string;
	hash: string;
	salt: string;
}

passport.deserializeUser((user: userLog, done) => {
	console.log("des >>", user);
	users
		.findOne({ _id: new ObjectId(user._id) })
		.then((user) => {
			done(null, user);
		})
		.catch((err) => done(err));
});

app.use(passport.initialize());
app.use(passport.session());

function isAuthenticated(
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/login");
	}
}

app.get("/login", (req, res) => {
	res.render("login");
});

app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/profile",
		failureRedirect: "/failure",
	})
); // call serialize: if has user store session

app.post("/register", (req, res) => {
	const username = req.body.username;
	const { hash, salt } = genPassword(req.body.password);
	users.insertOne({ username: username, hash: hash, salt: salt }).then(() => {
		res.redirect("/");
	});
});

app.get("/failure", (_, res) => {
	res.send("<h1>try again!!!</h1>");
});

app.get("/signout", (req, res) => {
	req.logOut({ keepSessionInfo: false }, () => {});
	res.redirect("/profile");
});

app.get("/", (req, res) => {
	res.send("<h1>Home Page</h1>");
});

app.get("/profile", isAuthenticated, (req, res) => {
	res.send("<h1>This is protected page</h1>");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`server run on port ${port}...`);
});
