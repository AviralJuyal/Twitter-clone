<template>
  <div
    class="bg-white dark:bg-dim-900 border-[1px] border-gray-300 dark:border-gray-700 p-4 mx-auto"
  >
    <div class="flex items-start space-x-4">
      <img
        :src="user.profileImage"
        alt="Profile Picture"
        class="w-10 h-10 rounded-full"
      />
      <div class="flex-1">
        <input
          type="text"
          v-model="text"
          placeholder="What is happening?!"
          class="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 text-black dark:text-white focus:outline-none focus:border-blue-500"
        />
        <!-- File selector  -->
        <div :class="inputImageUrl ? 'p-4' : 'p-0'">
          <img
            class="h-[300px] w-[600px] rounded-2xl"
            :src="inputImageUrl"
            v-if="inputImageUrl"
          />
          <input
            type="file"
            hidden
            ref="imageInput"
            accept="image/png, image/jpeg, image/gif"
            @change="handleImageChange"
          />
        </div>
        <div class="flex items-center justify-between mt-2">
          <!-- Icons  -->
          <div class="flex items-center space-x-1 text-blue-400">
            <button
              @click="handleImageClick"
              class="focus:outline-none hover:bg-blue-50 rounded-full dark:hover:bg-dim-800 p-2"
            >
              <IconImage />
            </button>
            <button
              class="focus:outline-none hover:bg-blue-50 rounded-full dark:hover:bg-dim-800 p-2"
            >
              <IconGif />
            </button>
            <button
              class="focus:outline-none hover:bg-blue-50 rounded-full dark:hover:bg-dim-800 p-2"
            >
              <IconPoll />
            </button>
            <button
              class="focus:outline-none hover:bg-blue-50 rounded-full dark:hover:bg-dim-800 p-2"
            >
              <IconEmoji />
            </button>
            <button
              class="focus:outline-none hover:bg-blue-50 rounded-full dark:hover:bg-dim-800 p-2"
            >
              <IconSchedule />
            </button>
          </div>

          <!-- Post  -->
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none disabled:bg-blue-300"
            @click="handleSubmit"
            :disabled="isDisabled"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const imageInput = ref();
const selectedImage = ref(null);
const inputImageUrl = ref(null);

const isDisabled = ref(true);

const emits = defineEmits(["onSubmit"]);

const text = ref("");

const { useAuthUser } = useAuth();

const user = useAuthUser();

const handleImageClick = () => {
  imageInput.value.click();
};

watch([text, inputImageUrl], async (newVal, oldVal) => {
  if (newVal[0].length > 0 || newVal[1]) {
    console.log("helo", newVal, oldVal);
    isDisabled.value = false;
  } else {
    isDisabled.value = true;
  }
});

const handleSubmit = () => {
  console.log("Submitted");
  emits("onSubmit", {
    text: text.value,
    mediaFiles: [selectedImage.value],
  });
};

const handleImageChange = (event) => {
  console.log(event.target.files[0]);
  const file = event.target.files[0];
  selectedImage.value = file;

  const reader = new FileReader();

  reader.onload = (event) => {
    inputImageUrl.value = event.target.result;
  };
  reader.readAsDataURL(file);
};
</script>

<style scoped></style>
