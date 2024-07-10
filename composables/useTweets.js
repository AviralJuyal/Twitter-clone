export default () => {
  const usePostTweetModal = () => useState("post_tweet_modal", () => false);

  const closePostTweetModal = () => {
    const postTweetModal = usePostTweetModal();
    postTweetModal.value = false;
  };

  const openPostTweetModal = () => {
    const postTweetModal = usePostTweetModal();
    postTweetModal.value = true;
  };

  const postTweet = (formData) => {
    const form = new FormData();
    form.append("text", formData.text);
    form.append("replyTo", formData.replyTo);

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

  const getTweetsOfUser = (username) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await useFetchApi(`/api/user/tweets/${username}`, {
          method: "GET",
        });
        console.log(response);
        resolve(response.tweets);
      } catch (error) {
        reject(error);
      }
    });
  };

  const getTweetById = (tweetId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await useFetchApi(`/api/tweets/${tweetId}`, {
          method: "GET",
        });
        console.log(response);
        resolve(response.tweet);
      } catch (error) {
        reject(error);
      }
    });
  };

  return {
    postTweet,
    getHomeTweets,
    getTweetById,
    closePostTweetModal,
    usePostTweetModal,
    openPostTweetModal,
    getTweetsOfUser,
  };
};
