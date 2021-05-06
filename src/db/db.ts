import { MongoClient } from "../../deps.ts";
import { UserSchema } from "./models/User.ts";
import { env } from "../../deps.ts";

const client = new MongoClient();
await client.connect(env.MONGODB);

const db = client.database("dinodb");
export const users = db.collection<UserSchema>("users");
