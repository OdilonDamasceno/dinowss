import { MongoClient } from "../../deps.ts";
import { UserSchema } from "./models/User.ts";
import { env } from "../../deps.ts";
const enviroment = Deno.env;
const client = new MongoClient();

const ATLAS = env.ATLAS ?? enviroment.get("ATLAS");
const CLUSTER = env.CLUSTER ?? enviroment.get("CLUSTER");
const HOST = env.HOST ?? enviroment.get("HOST");
const USERNAME = env.USERNAME ?? enviroment.get("USERNAME");
const PASSWORD = env.PASSWORD ?? enviroment.get("PASSWORD");
const DB_NAME = env.DB_NAME ?? enviroment.get("DB_NAME");

if (ATLAS === "true") {
  await client.connect({
    db: CLUSTER,
    tls: true,
    servers: [
      {
        host: HOST,
        port: 27017,
      },
    ],
    credential: {
      username: USERNAME,
      password: PASSWORD,
      db: DB_NAME,
      mechanism: "SCRAM-SHA-1",
    },
  });
} else {
  await client.connect(env.MONGODB);
}

const db = client.database(DB_NAME);

export const users = db.collection<UserSchema>("users");
