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
      <SidebarLeftTab active>
        <template v-slot:icon>
          <div class="w-8 h-8">
            <HomeIcon />
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

      <SidebarLeftTab>
        <template v-slot:icon>
          <div class="w-8 h-8">
            <UserIcon />
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
    >
      Post
    </button>
  </div>
</template>

<script setup>
import { HomeIcon } from "@heroicons/vue/24/solid";

import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  DocumentTextIcon,
  UserIcon,
} from "@heroicons/vue/24/outline";

const { defaultTransition } = useTailwindConfig();
</script>

<style scoped></style>
