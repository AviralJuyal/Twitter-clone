<template>
  <nuxt-link
    :to="navigateUrl"
    class="flex p-3 w-min hover:bg-gray-200 rounded-full dark:hover:bg-dim-200 dark:text-white"
    :class="defaultTransition"
  >
    <div class="w-6 h-6 text-dark">
      <slot name="icon"></slot>
    </div>

    <div class="ml-4 text-xl hidden xl:block" :class="textClasses">
      <slot name="title"></slot>
    </div>
  </nuxt-link>
</template>

<script setup>
const { defaultTransition } = useTailwindConfig();

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  navigateUrl: {
    type: String,
    default: "#",
  },
});

const textClasses = computed(() =>
  props.active ? "font-semibold" : "font-normal"
);
</script>

<style scoped></style>
