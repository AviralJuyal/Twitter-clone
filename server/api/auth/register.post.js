import { createUser, getUserByUsername } from "~/server/db/user";
import { userTransformer } from "~/server/transformer/user";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { username, email, name, password, repeatPassword } = body;
  if (!email || !username || !name || !password || !repeatPassword) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Missing some values" })
    );
  }

  if (password !== repeatPassword) {
    return sendError(
      event,
      createError({ statusCode: 400, statusMessage: "Password does not match" })
    );
  }

  // Checking if user exists or not
  let user = await getUserByUsername(username);
  if (user) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Username already exist",
      })
    );
  }

  const userData = {
    email,
    name,
    username,
    password,
    profileImage: "https://picsum.photos/200/200",
  };

  user = await createUser(userData);

  return {
    data: userTransformer(user),
  };
});
