import { prisma } from ".";
import { getUserByUsername } from "./user";

export const createTweet = (tweetData) => {
  return prisma.tweet.create({ data: tweetData });
};

export const getTweets = (params = {}) => {
  return prisma.tweet.findMany({
    ...params,
  });
};

export const getUserTweets = async (username, params = {}) => {
  const user = await getUserByUsername(username);

  return prisma.tweet.findMany({
    ...params,
    where: {
      authorId: user.id,
    },
  });
};

export const getTweetById = (tweetId, params = {}) => {
  return prisma.tweet.findUnique({
    ...params,
    where: {
      ...params.where,
      id: tweetId,
    },
  });
};
