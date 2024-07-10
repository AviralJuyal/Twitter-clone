<template>
  <div :class="{ dark: darkMode }">
    <div class="bg-white dark:bg-dim-900">
      <div
        v-if="isLoading"
        class="min-h-screen flex items-center justify-center"
      >
        <IconSpinner />
      </div>

      <!-- Main app  -->
      <div v-else-if="user" class="min-h-screen">
        <div class="grid grid-cols-12 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
          <!-- Left sidebar  -->
          <div class="hidden xs:block xs-col-span-1 xl:col-span-2">
            <div class="sticky top-0">
              <SidebarLeft
                :darkMode="darkMode"
                @toggleMode="handleToggleMode"
              />
            </div>
          </div>

          <!-- Main content  -->
          <main class="col-span-12 xs:col-span-10 md:col-span-8 xl:col-span-6">
            <NuxtPage />
          </main>

          <!-- Right sidebar  -->
          <div class="hidden md:block xl:col-span-4 md:col-span-3 col-span-12">
            <div class="sticky top-0">
              <SidebarRight />
            </div>
          </div>
        </div>
      </div>

      <AuthPage v-else />

      <UIModal :isOpen="postTweetModal" @closeModal="handleCloseModal">
        <TweetForm @onSuccess="handleOnSuccess" />
      </UIModal>
    </div>
  </div>
</template>

<script setup>
const darkMode = ref(false);

const { useAuthUser, initAuth, useAuthLoading } = useAuth();
const user = useAuthUser();

const isLoading = useAuthLoading();

const { closePostTweetModal, usePostTweetModal } = useTweets();

const postTweetModal = usePostTweetModal();

onBeforeMount(async () => {
  await initAuth();
  console.log(user);
  if (user) {
    if (useRoute().fullPath === "/")
      navigateTo({
        path: "/home",
      });
  }
});

const handleToggleMode = (val) => {
  darkMode.value = !darkMode.value;
  console.log(val, "VALUE", darkMode.value);
};

const handleOnSuccess = (tweet) => {
  navigateTo({
    path: "/status/" + tweet.id,
  });
  closePostTweetModal();
};

const handleCloseModal = () => {
  closePostTweetModal();
};

// console.log(user.value, "USER");
</script>
