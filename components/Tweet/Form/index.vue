<template>
  <div class="flex items-center justify-center mt-6" v-if="loading">
    <IconSpinner />
  </div>
  <div v-else>
    <TweetFormInput @onSubmit="handleSubmitForm" />
  </div>
</template>
<script setup>
const { postTweet } = useTweets();

const loading = ref(false);

const handleSubmitForm = async (data) => {
  //   console.log(data);
  //   alert(data.text);
  try {
    loading.value = true;
    const res = await postTweet(data);
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>
<style scoped></style>
