<template>
  <div class="flex items-center justify-center mt-6" v-if="loading">
    <IconSpinner />
  </div>
  <div v-else>
    <TweetFormInput :placeholder="placeholder" @onSubmit="handleSubmitForm" />
  </div>
</template>
<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: "What is happening?!",
  },
  replyTo: {
    type: Object,
    default: null,
  },
});

const emits = defineEmits(["onSuccess"]);

const { postTweet } = useTweets();

const loading = ref(false);

const handleSubmitForm = async (data) => {
  //   console.log(data);
  //   alert(data.text);
  try {
    loading.value = true;
    const res = await postTweet({ ...data, replyTo: props.replyTo?.id });
    console.log(res);
    emits("onSuccess", res.tweet);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>
