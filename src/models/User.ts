import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.1/mod.ts";

export interface User {
  id: string;
  email: string;
  ws: WebSocketClient;
}
