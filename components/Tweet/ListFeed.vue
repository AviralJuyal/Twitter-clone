<template>
  <div>
    <div v-if="isEmptyTweet">
      <p class="text-center text-gray-500 p-4">No Tweets found</p>
    </div>
    <div
      v-else
      class="pb-4 border-b hover:bg-gray-100 cursor-pointer dark:hover:bg-dim-300 border-gray-300 dark:border-gray-700"
      :class="defaultTransition"
      v-for="tweet of props.tweets"
    >
      <TweetItem :tweet="tweet" :key="tweet.id" />
      <!-- {{ tweet.text }}
        <div v-for="file of tweet.mediaFiles">
          <img :src="file.url" class="w-[500px] h-[200px]" />
        </div>
      </li> -->
    </div>
  </div>
</template>

<script setup>
const { defaultTransition } = useTailwindConfig();

const props = defineProps({
  tweets: {
    type: Array,
    required: true,
  },
});

const isEmptyTweet = computed(() => props.tweets.length === 0);
</script>
