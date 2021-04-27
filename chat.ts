import {WebSocket} from "https://deno.land/std@0.94.0/ws/mod.ts";
import {v4} from "https://deno.land/std@0.94.0/uuid/mod.ts";

/**
 * 
 */
const activeSessions = new Map();

export async function chat(ws: WebSocket) {
   const userId = v4.generate();
   activeSessions.set(userId, ws);

   for await (const data of ws) {
      activeSessions.forEach((wss: WebSocket, uuid:string) => {
         if(uuid != userId && !wss.isClosed) wss.send(`${data}`);
      });
   }
}
