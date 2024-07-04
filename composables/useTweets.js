export default () => {
  const postTweet = (formData) => {
    const form = new FormData();
    form.append("text", formData.text);
    formData.mediaFiles.forEach((file, i) => {
      form.append(`media_file_` + i, file);
    });

    return useFetchApi("/api/user/tweets", {
      method: "POST",
      body: form,
    });
  };

  const getHomeTweets = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await useFetchApi("/api/tweets", {
          method: "GET",
        });
        console.log(response);
        resolve(response.tweets);
      } catch (error) {
        reject(error);
      }
    });
  };

  return {
    postTweet,
    getHomeTweets,
  };
};
