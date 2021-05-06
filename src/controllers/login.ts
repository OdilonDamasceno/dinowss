import { bcrypt, WebSocketClient } from "../../deps.ts";
import { wss } from "../../mod.ts";
import { users } from "../db/db.ts";
import generateToken from "../scripts/generate_token.ts";

export async function login(json: Record<string, string>, ws: WebSocketClient) {
  const user = await users.findOne({ userName: json.userName });

  if (!user) {
    ws.send(`{"error":"User not found"}`);
    return false;
  }

  if (!await bcrypt.compare(json.password, user.password)) {
    ws.send(`{"error": "Invalid password"}`);
    return false;
  }

  wss.addListener(
    `${user.socketId}`,
    (data: string | Uint8Array) => ws.send(data),
  );

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

  return true;
}
