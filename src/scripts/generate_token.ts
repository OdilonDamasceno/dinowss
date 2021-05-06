import { create, env } from "../../deps.ts";
const enviroment = Deno.env;

export default async function generateToken(params = {}) {
  return await create(
    { alg: "HS512", typ: "JWT" },
    params,
    env.JWT ?? enviroment.get("JWT"),
  );
}
