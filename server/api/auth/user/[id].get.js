import { getUserByUsername } from "~/server/db/user";
import { userTransformer } from "~/server/transformer/user";

export default defineEventHandler(async (event) => {
  const username = event.context.params.id;

  const user = await getUserByUsername(username);
  return {
    user: userTransformer(user),
  };
});
