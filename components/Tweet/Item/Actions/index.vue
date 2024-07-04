<template>
  <div>
    <div class="flex text-gray-400 items-center cursor-pointer group w-auto">
      <div
        :class="`p-2 rounded-full group-hover:bg-${color}-100 group-hover:text-${color}-400 dark:group-hover:bg-opacity-20`"
      >
        <!-- <IconChat class="w-5 h-5" /> -->
        <slot classes="w-5 h-5" name="icon"></slot>
      </div>
      <span :class="`ml-1 group-hover:text-${color}-400`">
        <slot></slot>
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    required: true,
  },
});
</script>
