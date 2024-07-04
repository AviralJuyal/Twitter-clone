<template>
  <div
    class="border-[1px] border-gray-300 dark:border-gray-700 rounded-md dark:text-white text-black"
  >
    <h1 class="text-xl font-bold pb-3 border-b-[1px] pl-4 p-3">
      {{ props.title }}
    </h1>

    <!-- <div class="pl-4 p-3">
      <p>SpaceX</p>
      <span class="text-sm text-gray-300"> 18.7k Tweets </span>
    </div> -->
    <slot> </slot>

    <div
      class="p-3 text-sm text-blue-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-dim-300"
      :class="defaultTransition"
    >
      Show more
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const { defaultTransition } = useTailwindConfig();
</script>

<style scoped></style>
