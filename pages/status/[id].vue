<template>
  <div>
    <MainSection :title="'Tweet'" :loading="loading">
      <!-- Page title  -->
      <Head>
        <Title>{{ `${tweet.author.name} on Twitter: "${tweet.text}"` }}</Title>
      </Head>

      <!-- Input for tweet  -->
      <TweetDetails :tweet="tweet" />
    </MainSection>
  </div>
</template>

<script setup>
const loading = ref(false);

const tweet = ref(null);

const getTweetIdFromRoute = () => {
  return useRoute().params.id;
};

const { getTweetById } = useTweets();

const getTweet = async () => {
  try {
    loading.value = true;

    const res = await getTweetById(getTweetIdFromRoute());
    tweet.value = res;
    console.log(res, "RES");
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onBeforeMount(async () => {
  await getTweet();
});
</script>
