import { ObjectId } from "mongodb";

interface users {
	_id: ObjectId;
	username: string;
	hash: string;
	salt: string;
}

export { users };
