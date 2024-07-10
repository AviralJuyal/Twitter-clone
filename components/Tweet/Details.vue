<template>
  <div>
    <TweetItem :tweet="tweet" />
    <!-- <div class="border-b border-gray-300 dark:border-gray-700"> -->
    <TweetForm
      :placeholder="'Tweet your reply'"
      :replyTo="props.tweet"
      @onSuccess="handleOnSuccess"
    />
    <!-- </div> -->
    <TweetListFeed :tweets="replies" compact />
  </div>
</template>

<script setup>
const props = defineProps({
  tweet: {
    type: Object,
    required: true,
  },
});

const replies = computed(() => props.tweet?.replies || []);

const handleOnSuccess = (tweet) => {
  navigateTo({
    path: "/status/" + tweet.id,
  });
};
</script>
