import { getUserByUsername } from "~/server/db/user";
import { userTransformer } from "~/server/transformer/user";
import bcrypt from "bcrypt";
import { generateTokens } from "../../utils/jwt";
import { createRefreshToken, sendRefreshToken } from "../../db/refreshTokens";

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  if (!username || !password) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Missing username or password",
      })
    );
  }
  //   const userData = { username, password };
  //   console.log(userData);

  // Checking if user exists or not
  const user = await getUserByUsername(username);
  if (!user) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Username does not exist",
      })
    );
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Username or password is incorrect",
      })
    );
  }

  const { accessToken, refreshToken } = generateTokens(user);

  // This saves the refresh token in the db
  await createRefreshToken({ token: refreshToken, userId: user.id });

  // This is used to save the refresh token in cookie
  await sendRefreshToken(event, refreshToken);

  return { accessToken, user: userTransformer(user) };
});
