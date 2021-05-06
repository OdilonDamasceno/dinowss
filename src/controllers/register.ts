import { bcrypt, v4, WebSocketClient } from "../../deps.ts";
import { users } from "../db/db.ts";

export async function register(
  json: Record<string, string>,
  ws: WebSocketClient,
) {
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
    return false;
  }
  ws.emit(
    "message",
    JSON.stringify({
      type: "login",
      userName: json.userName,
      password: json.password,
    }),
  );
  return true;
}
