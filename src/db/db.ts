import { MongoClient } from "../../deps.ts";
import { UserSchema } from "./models/User.ts";

const client = new MongoClient();
await client.connect("mongodb://172.17.0.2:27017:27017");

const db = client.database("dinodb");
export const users = db.collection<UserSchema>("users");
