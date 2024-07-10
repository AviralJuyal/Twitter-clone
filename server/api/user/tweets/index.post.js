import formidable from "formidable";
import { createMediaFile } from "~/server/db/mediaFiles";
import { createTweet } from "~/server/db/tweet";

export default defineEventHandler(async (event) => {
  const form = formidable({});

  const response = await new Promise((resolve, reject) => {
    form.parse(event.req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const userId = event.context.auth?.user?.id;

  const tweetData = {
    text: response.fields.text[0],
    authorId: userId,
  };

  const replyTo = response.fields?.replyTo[0];
  if (replyTo && replyTo !== null && replyTo !== "undefined") {
    tweetData.replyToId = replyTo;
  }

  const tweet = await createTweet(tweetData);

  const filePromises = Object.keys(response.files).map(async (key) => {
    const file = response.files[key];

    //
    const res = await uploadImage(file[0].filepath);

    return createMediaFile({
      tweetId: tweet.id,
      userId,
      url: res?.secure_url,
      providerPublicId: res?.public_id,
    });
  });

  await Promise.all(filePromises);
  return { tweet };
});
