<template>
  <div
    class="flex flex-col gap-4 mt-2 border-l-[1px] border-gray-300 dark:border-gray-700 pl-10"
  >
    <div class="relative m-2">
      <div
        class="absolute flex items-center h-full pl-4 text-gray-600 cursor-pointer"
      >
        <div class="w-6 h-6">
          <IconSearch />
        </div>
      </div>

      <input
        class="flex items-center w-full pl-12 text-sm font-normal text-black dark:text-gray-100 rounded-full shadow dark:bg-dim-400 bg-gray-200 dark:border-dim-400 focus:bg-gray-100 dark:focus:bg-dim-900 focus:outline-none focus:border focus:border-blue-200 h-9"
        placeholder="Search Twitter"
        type="text"
        v-model="search"
      />
    </div>

    <SidebarRightPreviewCard title="What's happeing">
      <div
        v-for="whatsHappening in whatsHappeningItems"
        class="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-dim-300 border-b-[1px]"
        :class="defaultTransition"
      >
        <h2>
          {{ whatsHappening.title }}
        </h2>
        <p class="text-gray-400 text-sm">
          {{ whatsHappening.count }}
        </p>
      </div>
    </SidebarRightPreviewCard>

    <SidebarRightPreviewCard title="Who to follow">
      <div
        v-for="whoToFollow in whoToFollowItems"
        class="cursor-pointer hover:bg-gray-100 dark:hover:bg-dim-300 border-b-[1px] flex justify-between pe-2 items-center"
      >
        <div class="flex items-center pl-3">
          <img
            :src="whoToFollow.pp"
            alt="img"
            class="rounded-full h-10 w-10 object-fill"
          />
          <div class="py-3 pl-2" :class="defaultTransition">
            <h2>
              {{ whoToFollow.name }}
            </h2>
            <p class="text-gray-400 text-sm">
              {{ whoToFollow.userId }}
            </p>
          </div>
        </div>

        <button
          class="dark:bg-white bg-black rounded-2xl font-semibold flex items-center h-7 p-4 text-white dark:text-black"
        >
          Follow
        </button>
      </div>
    </SidebarRightPreviewCard>
  </div>
</template>

<script setup>
const whatsHappeningItems = ref([
  {
    title: "SpaceX",
    count: "18.7k Tweets",
  },
  {
    title: "SpaceX",
    count: "18.7k Tweets",
  },
  {
    title: "SpaceX",
    count: "18.7k Tweets",
  },
]);

const whoToFollowItems = ref([
  {
    name: "Aviral Juyal",
    userId: "@aviraljuyal",
    pp: "https://picsum.photos/200/200",
  },
  {
    name: "Aviral Juyal",
    userId: "@aviraljuyal",
    pp: "https://picsum.photos/200/200",
  },
  {
    name: "Aviral Juyal",
    userId: "@aviraljuyal",
    pp: "https://picsum.photos/200/200",
  },
]);

const search = ref("");
</script>

<style scoped></style>
