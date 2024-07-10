<template>
  <div class="bg-white rounded-lg overflow-hidden shadow-md" v-if="user">
    <div class="relative">
      <div class="bg-gray-200 h-24"></div>
      <img
        class="absolute top-8 max-h-24 left-1/2 transform -translate-x-1/2 rounded-full border-4 border-white"
        :src="user.profileImage"
        alt="https://via.placeholder.com/80"
      />
    </div>
    <div class="text-center mt-16">
      <h2 class="text-xl font-semibold">{{ user.name }}</h2>

      <p class="text-gray-500">{{ user.handle }}</p>
      <p class="text-gray-500">Joined {{ user.joinedAtHuman }}</p>
      <!-- <div class="flex justify-center space-x-4 mt-4">
        <div class="text-center">
          <p class="text-gray-800 font-semibold">40</p>
          <p class="text-gray-500">Following</p>
        </div>
        <div class="text-center">
          <p class="text-gray-800 font-semibold">48</p>
          <p class="text-gray-500">Followers</p>
        </div>
      </div> -->
    </div>
    <div class="border-t mt-4">
      <nav class="flex justify-around text-gray-500">
        <a href="#" class="py-4 text-blue-500 border-b-2 border-blue-500"
          >Posts</a
        >
        <!-- <a href="#" class="py-4">Replies</a>
        <a href="#" class="py-4">Highlights</a>
        <a href="#" class="py-4">Articles</a>
        <a href="#" class="py-4">Media</a>
        <a href="#" class="py-4">Likes</a> -->
      </nav>
    </div>
    <div class="p-4">
      <div v-if="isEmptyTweet">
        <p class="text-center text-gray-500 p-4">No Tweets found</p>
      </div>

      <div
        v-else
        class="pb-4 border-b hover:bg-gray-100 cursor-pointer dark:hover:bg-dim-300 border-gray-300 dark:border-gray-700"
        :class="defaultTransition"
        v-for="tweet of tweets"
        @click="() => handleNavigation(tweet.id)"
      >
        <TweetItem :tweet="tweet" :key="tweet.id" compact />
      </div>
    </div>
  </div>
</template>

<script setup>
const tweets = ref([]);

const isEmptyTweet = computed(() => tweets.length === 0);

const { getTweetsOfUser } = useTweets();
const { getUserByUsername } = useAuth();

const getUsernameFromRoute = () => {
  return useRoute().params.id;
};

const user = ref(null);

onBeforeMount(async () => {
  tweets.value = await getTweetsOfUser(getUsernameFromRoute());
  user.value = await getUserByUsername(getUsernameFromRoute());

  console.log(user);
});

const handleNavigation = (id) => {
  navigateTo({
    path: "/status/" + id,
  });
};
</script>
