import UrlPattern from "url-pattern";
import { getUserById } from "../db/user";

export default defineEventHandler(async (event) => {
  const endpoints = [
    "/api/auth/user",
    "/api/user/tweets",
    "/api/tweets",
    "/api/tweets/:id",
  ];

  const isHandledByMiddleware = endpoints.some((endpoint) => {
    const pattern = new UrlPattern(endpoint);
    return pattern.match(event.req.url);
  });

  if (!isHandledByMiddleware) {
    return;
  }

  const token = event.req.headers["authorization"]?.split(" ")[1];

  const decode = decodeAuthToken(token);

  if (!decode) {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Unauthorized" })
    );
  }
  try {
    const { userId } = decode;
    const user = await getUserById(userId);

    event.context.auth = { user };
  } catch (error) {
    return;
  }
});
