<template>
  <div class="p-4 flex">
    <div>
      <img class="w-10 h-10 rounded-full" :src="author.profileImage" />
    </div>
    <div class="ml-3">
      <span class="font-medium text-gray-800 dark:text-white">{{
        author.name
      }}</span>
      <span class="ml-3 text-sm font-medium text-gray-400">
        <nuxt-link :to="`/profile/${author.username}`">
          {{ author.handle }}
        </nuxt-link>
        . {{ tweet.postedAtHuman }}
      </span>

      <!-- If replying to anyone  -->
      <p v-if="tweet.replyTo" class="text-sm">
        <span class="text-gray-500"> Replying to </span>
        <nuxt-link :to="tweet.replyTo.id" class="text-blue-400">
          {{ tweet.replyTo.author.handle }}
        </nuxt-link>
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tweet: {
    type: Object,
    required: true,
  },
});

const author = props.tweet.author;

const replyToTweetUrl = computed(() => `status/${props.tweet?.replyTo?.id}`);
</script>
