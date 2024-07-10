<template>
  <div>
    <MainSection :title="'Home'" :loading="loading">
      <!-- Page title  -->
      <Head>
        <Title>Home / Twitter</Title>
      </Head>

      <!-- Input for tweet  -->
      <div class="border-b border-gray-300 dark:border-gray-700">
        <TweetForm @onSuccess="handleOnSuccess" />
      </div>

      <!-- Feed  -->
      <div>
        <TweetListFeed :tweets="homeTweet" />
      </div>
    </MainSection>
  </div>
</template>

<script setup>
let loading = ref(false);
const { useAuthUser } = useAuth();

const user = useAuthUser();

const homeTweet = ref([{ 1: 3 }, { 3: 9 }]);

const { getHomeTweets } = useTweets();

const handleOnSuccess = (tweet) => {
  navigateTo({
    path: "/status/" + tweet.id,
  });
};

onBeforeMount(async () => {
  try {
    loading.value = true;
    homeTweet.value = await getHomeTweets();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
});
</script>
