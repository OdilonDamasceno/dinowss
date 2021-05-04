import { parse } from "../deps.ts";
import { connection } from "./controllers/connection.ts";
import { WebSocketClient, WebSocketServer } from "../deps.ts";

const { args } = Deno;
const WSS = parse(args).wss ?? 8001;
const wss = new WebSocketServer(WSS);

wss.on("connection", (ws: WebSocketClient) => connection(ws, wss));

console.log("WebSocket running on port", WSS);
