<template>
  <div>
    <!-- Header  -->
    <TweetItemHeader :tweet="tweet" />

    <!-- body  -->
    <div :class="tweetBodyWrapper">
      <p
        class="flex-shrink font-medium text-gray-800 w-auto dark:text-white"
        :class="textSize"
      >
        {{ tweet.text }}
      </p>
      <div
        class="flex my-3 mr-2 border-2 rounded-2xl border-gray-300 dark:border-gray-700"
        v-for="image in tweet.mediaFiles"
        :key="image.id"
      >
        <img :src="image.url" class="rounded-2xl w-full" />
      </div>

      <!-- action buttons  -->
      <div class="mt-2 flex items-center justify-around w-full">
        <!-- Chat icon  -->
        <TweetItemActions :color="'blue'">
          <template v-slot:icon="{ classes }">
            <IconChat :class="classes" />
          </template>
          <template v-slot:default> {{ tweet.repliesCount }} </template>
        </TweetItemActions>

        <!-- Repost icon  -->
        <TweetItemActions :color="'green'">
          <template v-slot:icon="{ classes }">
            <IconRepost :class="classes" />
          </template>
          <template v-slot:default> {{ generateRandomNumber() }} </template>
        </TweetItemActions>

        <!-- Like icon  -->
        <TweetItemActions :color="'red'">
          <template v-slot:icon="{ classes }">
            <IconLike :class="classes" />
          </template>
          <template v-slot:default> {{ generateRandomNumber() }} </template>
        </TweetItemActions>

        <!-- Insights icon  -->
        <TweetItemActions :color="'blue'">
          <template v-slot:icon="{ classes }">
            <IconInsights :class="classes" />
          </template>
          <template v-slot:default> {{ generateRandomNumber() }} </template>
        </TweetItemActions>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tweet: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const tweetBodyWrapper = computed(() => (props.compact ? "ml-16" : "ml-2"));
const textSize = computed(() => (props.compact ? "text-base" : "text-2xl"));

const generateRandomNumber = () => {
  return Math.floor(Math.random() * 100);
};
</script>
