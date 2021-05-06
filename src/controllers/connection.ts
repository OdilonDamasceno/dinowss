import { Bson, WebSocketClient } from "../../deps.ts";
import { users } from "../db/db.ts";
import { wss } from "../../mod.ts";
import { UserSchema } from "../db/models/User.ts";
import { message } from "./message.ts";
import { login } from "./login.ts";
import { connect } from "./connect.ts";
import { register } from "./register.ts";

export function connection(ws: WebSocketClient) {
  let user: UserSchema;

  ws.on("message", async (data: string) => {
    try {
      const json: Record<string, string> = JSON.parse(data);
      switch (json.type) {
        case "message": {
          await message(json);
          break;
        }
        case "join": {
          break;
        }
        case "login": {
          await login(json, ws);
          break;
        }
        case "connect": {
          await connect(json, ws, user);
          break;
        }
        case "register": {
          await register(json, ws);
          break;
        }
        default:
          break;
      }
    } catch (error) {
      ws.send(`{"error": "${error}"}`);
    }
  });

  ws.on("close", () => {
    if (user) {
      users.updateOne({ _id: new Bson.ObjectID(user._id) }, {
        $set: {
          isOnline: false,
        },
      });
      wss.removeAllListeners(user.socketId);
    }
  });
}
