<template>
  <!-- <div class="flex h-screen dark:text-white">PLEASE LOGIN</div> -->

  <!-- Signup  -->
  <div
    v-if="!isLogin"
    class="min-h-screen bg-gray-100 text-gray-900 flex justify-center dark:bg-dim-900"
  >
    <div
      class="max-w-screen-xl m-0 bg-white shadow sm:rounded-lg flex justify-center flex-1 dark:bg-dim-800"
    >
      <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <div class="mt-12 flex flex-col items-center">
          <h1 class="text-2xl xl:text-3xl font-extrabold dark:text-white">
            Signup
          </h1>
          <div class="w-full flex-1 mt-8">
            <div class="mx-auto max-w-xs">
              <input
                class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white dark:bg-dim-700 dark:border-dim-600 dark:placeholder-gray-400 dark:text-white"
                type="text"
                placeholder="Username"
                v-model="formData.username"
              />
              <input
                class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 dark:bg-dim-700 dark:border-dim-600 dark:placeholder-gray-400 dark:text-white"
                type="email"
                placeholder="Email"
                v-model="formData.email"
              />
              <input
                class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 dark:bg-dim-700 dark:border-dim-600 dark:placeholder-gray-400 dark:text-white"
                type="text"
                placeholder="Name"
                v-model="formData.name"
              />
              <input
                class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 dark:bg-dim-700 dark:border-dim-600 dark:placeholder-gray-400 dark:text-white"
                type="password"
                placeholder="Password"
                v-model="formData.password"
              />
              <input
                class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 dark:bg-dim-700 dark:border-dim-600 dark:placeholder-gray-400 dark:text-white"
                type="password"
                placeholder="Repeat Password"
                v-model="formData.repeatPassword"
              />
              <button
                class="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none dark:bg-dim-600 dark:hover:bg-dim-500"
                @click="handleSignup"
              >
                <svg
                  class="w-6 h-6 -ml-2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                <span class="ml-3">Signup</span>
              </button>

              <p class="text-xs mt-5 text-gray-600 dark:text-gray-400">
                Already a user?
                <a
                  href="#"
                  @click.prevent="toggleForm"
                  class="border-b border-gray-500 border-dotted dark:border-gray-400"
                  >Login</a
                >
              </p>

              <p
                class="mt-4 text-xs text-gray-600 text-center dark:text-gray-400"
              >
                I agree to abide by Twitter's
                <a
                  href="#"
                  class="border-b border-gray-500 border-dotted dark:border-gray-400"
                  >Terms of Service</a
                >
                and its
                <a
                  href="#"
                  class="border-b border-gray-500 border-dotted dark:border-gray-400"
                  >Privacy Policy</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex-1 bg-indigo-100 text-center hidden lg:flex dark:bg-dim-700"
      >
        <div
          class="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
          style="
            background-image: url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg');
          "
        ></div>
      </div>
    </div>
  </div>

  <!-- Login  -->
  <div
    v-else
    class="min-h-screen bg-gray-100 text-gray-900 flex justify-center dark:bg-dim-900"
  >
    <div
      class="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1 dark:bg-dim-800"
    >
      <div class="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <div class="mt-12 flex flex-col items-center">
          <h1 class="text-2xl xl:text-3xl font-extrabold dark:text-white">
            Login
          </h1>
          <div class="w-full flex-1 mt-8">
            <div class="mx-auto max-w-xs">
              <input
                class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white dark:bg-dim-700 dark:border-dim-600 dark:placeholder-gray-400 dark:text-white"
                type="text"
                placeholder="Username"
                v-model="formData.username"
              />
              <input
                class="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 dark:bg-dim-700 dark:border-dim-600 dark:placeholder-gray-400 dark:text-white"
                type="password"
                placeholder="Password"
                v-model="formData.password"
              />
              <button
                class="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none dark:bg-dim-600 dark:hover:bg-dim-500"
                @click="handleLogin"
              >
                <svg
                  class="w-6 h-6 -ml-2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                <span class="ml-3">Login</span>
              </button>

              <p class="text-xs mt-5 text-gray-600 dark:text-gray-400">
                New user?
                <a
                  href="#"
                  @click.prevent="toggleForm"
                  class="border-b border-gray-500 border-dotted dark:border-gray-400"
                  >Sign up</a
                >
              </p>

              <p
                class="mt-6 text-xs text-gray-600 text-center dark:text-gray-400"
              >
                I agree to abide by Twitter's
                <a
                  href="#"
                  class="border-b border-gray-500 border-dotted dark:border-gray-400"
                  >Terms of Service</a
                >
                and its
                <a
                  href="#"
                  class="border-b border-gray-500 border-dotted dark:border-gray-400"
                  >Privacy Policy</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex-1 bg-indigo-100 text-center hidden lg:flex dark:bg-dim-700"
      >
        <div
          class="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
          style="
            background-image: url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg');
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { login } = useAuth();
const isLogin = ref(true);
const formData = reactive({
  username: "",
  name: "",
  password: "",
  repeatPassword: "",
  email: "",
});

// To toggle between login and signup
const toggleForm = () => {
  isLogin.value = !isLogin.value;
};

const handleSignup = () => {
  alert(JSON.stringify(formData));
};

const handleLogin = () => {
  // alert(JSON.stringify(formData));
  try {
    login({ username: formData.username, password: formData.password });
  } catch (error) {
    console.log(error);
  }
};
</script>
<style scoped></style>
