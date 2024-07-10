<template>
  <div
    class="flex flex-col h-screen border-r-[1px] border-gray-300 dark:border-gray-700 pr-10"
  >
    <div
      class="p-2 my-2 rounded-full hover:bg-blue-50 w-min dark:hover:bg-white/20"
      :class="defaultTransition"
    >
      <nuxt-link to="/">
        <div class="w-8 h-8">
          <IconTwitter />
        </div>
      </nuxt-link>
    </div>

    <div class="mt-2 space-y-3">
      <SidebarLeftTab :active="getActiveRoute('home')" navigateUrl="/home">
        <template v-slot:icon>
          <div class="w-8 h-8">
            <HomeActive v-if="getActiveRoute('home')" />
            <HomeIcon v-else />
          </div>
        </template>

        <template v-slot:title> Home </template>
      </SidebarLeftTab>

      <SidebarLeftTab>
        <template v-slot:icon>
          <div class="w-8 h-8">
            <HashtagIcon />
          </div>
        </template>

        <template v-slot:title> Explore </template>
      </SidebarLeftTab>

      <SidebarLeftTab>
        <template v-slot:icon>
          <div class="w-8 h-8">
            <BellIcon />
          </div>
        </template>

        <template v-slot:title> Notification </template>
      </SidebarLeftTab>

      <SidebarLeftTab>
        <template v-slot:icon>
          <div class="w-8 h-8">
            <InboxIcon />
          </div>
        </template>

        <template v-slot:title> Messages </template>
      </SidebarLeftTab>

      <SidebarLeftTab>
        <template v-slot:icon>
          <div class="w-8 h-8">
            <BookmarkIcon />
          </div>
        </template>

        <template v-slot:title> Bookmark </template>
      </SidebarLeftTab>

      <SidebarLeftTab>
        <template v-slot:icon>
          <div class="w-8 h-8">
            <DocumentTextIcon />
          </div>
        </template>

        <template v-slot:title> Lists </template>
      </SidebarLeftTab>

      <SidebarLeftTab
        :active="getActiveRoute('profile')"
        :navigateUrl="`/profile/${user.username}`"
      >
        <template v-slot:icon>
          <div class="w-8 h-8">
            <UserActive v-if="getActiveRoute('profile')" />
            <UserIcon v-else />
          </div>
        </template>

        <template v-slot:title> Profile </template>
      </SidebarLeftTab>

      <!-- <SidebarLeftTab>
        <template v-slot:icon>
          <div class="w-10 h-10">
            <IconMore />
          </div>
        </template>

        <template v-slot:title> More </template>
      </SidebarLeftTab> -->

      <!-- <SidebarLeftTab>
        <template v-slot:icon>
          <div class="w-10 h-10">
            <IconPencil />
          </div>
        </template>

        <template v-slot:title> Tweet </template>
      </SidebarLeftTab> -->
      <!-- Post  -->
      <!-- @click="handleSubmit" -->
    </div>
    <button
      class="bg-blue-500 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none mt-4"
      @click="openPostTweetModal"
    >
      Post
    </button>
    <!-- class="bg-dim-800 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none mt-4" -->

    <button
      v-if="darkMode"
      @click="handleClick"
      class="text-white border-[1px] rounded-2xl p-2 mt-2 flex items-center justify-center gap-2"
    >
      Light mode <IconSun />
    </button>
    <button
      v-else
      @click="handleClick"
      class="text-black border-[1px] rounded-2xl p-2 mt-2 flex items-center justify-center gap-2"
    >
      Dark mode <IconMoon />
    </button>
  </div>
</template>

<script setup>
const handleClick = () => {
  console.log("click");
  emits("toggleMode");
};
const props = defineProps({
  darkMode: {
    type: Boolean,
    default: false,
  },
});

import {
  HomeIcon as HomeActive,
  UserIcon as UserActive,
} from "@heroicons/vue/24/solid";

import {
  HomeIcon,
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  DocumentTextIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";

const { defaultTransition } = useTailwindConfig();

const { openPostTweetModal } = useTweets();

const { useAuthUser } = useAuth();
const emits = defineEmits(["toggleMode"]);
const user = useAuthUser();

const getActiveRoute = (url) => {
  return useRoute().fullPath.includes(url);
};

const toggleDisplay = () => {
  emits("toggleMode");
  console.log("Clicked to toggle");
};

// console.log(getActiveRoute("profile"));
</script>
