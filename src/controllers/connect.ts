import { env, verify, WebSocketClient } from "../../deps.ts";
import { wss } from "../../mod.ts";
import { users } from "../db/db.ts";
import { UserSchema } from "../db/models/User.ts";

export async function connect(
  json: Record<string, string>,
  ws: WebSocketClient,
  user: UserSchema,
) {
  const payload = await verify(json.token, env.JWT, "HS512");
  if (!json.token) {
    ws.send(`{"error":"No token provided"}`);
    return false;
  }

  if (payload.id == json.id) {
    await users.updateOne({ _id: json.id }, {
      $set: {
        isOnline: true,
      },
    });
  }

  wss.addListener(
    `${json.socketId}`,
    (data: string | Uint8Array) => ws.send(data),
  );

  const pending = user.pending;
  pending.forEach((message) => {
    ws.send(JSON.stringify(message));
  });

  users.updateOne({ _id: user._id }, {
    $set: { pending: [] },
  });
  return true;
}
