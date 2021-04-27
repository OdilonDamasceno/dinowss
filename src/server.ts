import { parse } from "https://deno.land/std/flags/mod.ts";
import { connection } from "./controllers/connection.ts";
import { WebSocketServer } from "https://deno.land/x/websocket@v0.1.1/mod.ts";

const { args } = Deno;
const DEFAULT_WSSPORT = 8001;
const PORT = parse(args).port;
const WSS = parse(args).wss;
const WS = WSS ? Number(PORT) : DEFAULT_WSSPORT;

const wss = new WebSocketServer(WS);

wss.on("connection", connection);

console.log("Server running on port", WS);