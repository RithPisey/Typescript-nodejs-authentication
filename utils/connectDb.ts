import { MongoClient, ObjectId } from "mongodb";
const uri = `mongodb://localhost:27017`;
const client = new MongoClient(uri);
export { client, uri };
