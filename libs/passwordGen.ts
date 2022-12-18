import crypto from "crypto";

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

export { genPassword, validPassword };
