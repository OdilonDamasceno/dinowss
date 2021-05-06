import { connection } from "./controllers/connection.ts";
import { wss } from "../mod.ts";

wss.on("connection", connection);
