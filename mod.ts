import { parse } from "./deps.ts";
import { WebSocketServer } from "./deps.ts";

const { args } = Deno;
const WSS = parse(args).wss ?? 8001;
export const wss = new WebSocketServer(WSS);
