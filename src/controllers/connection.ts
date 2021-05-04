import { v4 } from "../../deps.ts";
import { Bson } from "../../deps.ts";
import { bcrypt } from "../../deps.ts";
import { users } from "../db/db.ts";
import { WebSocketClient, WebSocketServer } from "../../deps.ts";
import { env } from "../../deps.ts";
import { create, verify } from "../../deps.ts";
import { UserSchema } from "../db/models/User.ts";

async function generateToken(params = {}) {
  return await create({ alg: "HS512", typ: "JWT" }, params, env.JWT);
}

export function connection(ws: WebSocketClient, wss: WebSocketServer) {
  let user: UserSchema | undefined;

  ws.on("message", async (data: string) => {
    try {
      const json: Record<string, string> = JSON.parse(data);
      switch (json.type) {
        case "message": {
          if (wss.eventNames().find((to) => to === json.to)) {
            wss.emit(
              `${json.to}`,
              JSON.stringify({
                from: json.from,
                message: json.message,
                at: Date.now(),
              }),
            );
            break;
          }
          await users.updateOne({ socketId: json.to }, {
            $push: {
              pending: {
                from: json.from,
                message: json.message,
                at: Date.now(),
              },
            },
          });

          break;
        }
        case "join": {
          break;
        }
        case "login": {
          user = await users.findOne({ userName: json.userName });

          if (!user) {
            ws.send(`{"error":"User not found"}`);
            break;
          }

          if (!await bcrypt.compare(json.password, user.password)) {
            ws.send(`{"error": "Invalid password"}`);
            break;
          }

          wss.addListener(`${user.socketId}`, (data) => ws.send(data));

          user.password = "";
          const pending = user.pending;
          user.pending = [];

          ws.send(JSON.stringify({
            user,
            type: "auth",
            socketId: user.socketId,
            token: await generateToken({ id: user }),
          }));

          pending.forEach((message) => {
            ws.send(JSON.stringify(message));
          });

          users.updateOne({ _id: user._id }, {
            $set: { pending: [], isOnline: true },
          });

          break;
        }
        case "connect": {
          const payload = await verify(json.token, env.JWT, "HS512");
          if (!json.token) {
            ws.send(`{"error":"No token provided"}`);
            break;
          }

          if (payload.id == json.id) {
            await users.updateOne({ _id: json.id }, {
              $set: {
                isOnline: true,
              },
            });
          }

          wss.addListener(`${json.socketId}`, (data) => ws.send(data));

          const pending = user?.pending;
          pending?.forEach((message) => {
            ws.send(JSON.stringify(message));
          });

          users.updateOne({ _id: user?._id }, {
            $set: { pending: [] },
          });

          break;
        }
        case "register": {
          if (!await users.findOne({ userName: json.userName })) {
            const socketId = v4.generate();
            await users.insertOne({
              userName: json.userName,
              isOnline: !ws.isClosed,
              socketId: socketId,
              password: await bcrypt.hash(json.password),
            });
          } else {
            ws.send(`{"error": "User already taken"}`);
            break;
          }
          ws.emit(
            "message",
            JSON.stringify({
              type: "login",
              userName: json.userName,
              password: json.password,
            }),
          );
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
