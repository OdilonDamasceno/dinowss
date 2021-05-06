import { assertEquals, env, verify } from "../deps.ts";
import generateToken from "../src/scripts/generate_token.ts";
const enviroment = Deno.env;

Deno.test("jwt", async () => {
  const token = await generateToken({ _id: "1234" });
  assertEquals<string>(typeof token, "string", "Type of token is string!");
  const promise = await verify(
    token,
    env.JWT ?? enviroment.get("JWT"),
    "HS512",
  );
  assertEquals(promise._id, "1234", "Token verified!");
});
