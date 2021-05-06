import { wss } from "../../mod.ts";
import { users } from "../db/db.ts";

export async function message(json: Record<string, string>) {
  if (wss.eventNames().find((to) => to === json.to)) {
    wss.emit(
      `${json.to}`,
      JSON.stringify({
        from: json.from,
        message: json.message,
        at: Date.now(),
      }),
    );
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

  return true;
}
