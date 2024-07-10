import { getUserTweets } from "~/server/db/tweet";
import { tweetTransformer } from "~/server/transformer/tweet";

export default defineEventHandler(async (event) => {
  const username = event.context.params.id;

  const tweets = await getUserTweets(username, {
    include: {
      author: true,
      mediaFiles: true,
      replies: {
        include: {
          author: true,
        },
      },
      replyTo: {
        include: {
          author: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
  return {
    tweets: tweets.map(tweetTransformer),
  };
});
