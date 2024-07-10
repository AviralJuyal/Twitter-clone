import { userTransformer } from "~/server/transformer/user";

export default defineEventHandler((event) => {
  return {
    user: userTransformer(event.context.auth.user),
  };
});
