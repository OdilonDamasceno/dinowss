import { v4 } from "https://deno.land/std@0.94.0/uuid/mod.ts";
import { faker } from "https://deno.land/x/deno_faker@v1.0.0/mod.ts";
import { User } from "../models/User.ts";
import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.1/mod.ts";

const users: Array<User> = [];

export function connection(ws: WebSocketClient) {
  const userId = v4.generate();

  users.push({
    "id": userId,
    "email": faker.internet.email(),
    "ws": ws,
  });

  ws.send(`Your id is: ${userId}`);

  ws.on("message", (message: string) => {
    try {
      const json = JSON.parse(message);
      switch (json.type) {
        case "new": {
          const to: User | undefined = users.find((rec) => {
            if (rec.id === json.to) return rec;
          });

          if (to) {
            to.ws.send(`{"from": "${json.from}", "message":"${json.message}"}`);
          }

          break;
        }

        default:
          break;
      }
    } catch (error) {
      ws.send(`{ "error": "${error}" }`);
    }
  });
}
