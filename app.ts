import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookiesParser from "cookie-parser";
import { client, uri } from "./utils/connectDb";
import {
	initialize_passport,
	session_passport,
	verifyUser,
} from "./security/passport";
import { HomeController } from "./controllers/home.controller";
import { ProfileController } from "./controllers/profile.controller";
import { LoginController } from "./controllers/login.controller";
import { registerController } from "./controllers/register.controller";
import { LoginTokenController } from "./controllers/login_token.controller";
import { registerTokenController } from "./controllers/register_token.controller";
import { ProfileTokenController } from "./controllers/profileToken.controller";

class application {
	public app: express.Application;
	private HomeController: HomeController;
	private ProfileController: ProfileController;
	private LoginController: LoginController;
	private registerController: registerController;
	private loginTokenController: LoginTokenController;
	private registerTokenController: registerTokenController;
	private profileTokenController: ProfileTokenController;
	constructor() {
		this.HomeController = new HomeController();
		this.ProfileController = new ProfileController();
		this.LoginController = new LoginController(verifyUser);
		this.registerController = new registerController();
		this.loginTokenController = new LoginTokenController(verifyUser);
		this.registerTokenController = new registerTokenController();
		this.profileTokenController = new ProfileTokenController();
		this.app = express();
		this.instantiate();
	}

	private instantiate() {
		this.config();
		this.routController();
	}

	private routController() {
		this.app.use(this.HomeController.router);
		this.app.use(this.ProfileController.router);
		this.app.use(this.LoginController.router);
		this.app.use(this.registerController.router);
		this.app.use(this.loginTokenController.router);
		this.app.use(this.registerTokenController.router);
		this.app.use(this.profileTokenController.router);
	}

	private config() {
		this.app.use(express.static("public"));
		this.app.set("views", __dirname + "/views");
		this.app.set("view engine", "ejs");
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookiesParser());
		this.app.use(
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
		this.app.use(initialize_passport);
		this.app.use(session_passport);
	}
}

export default new application().app;
