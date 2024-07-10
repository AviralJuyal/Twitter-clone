<template>
  <div>
    <ProfileCard />
  </div>
</template>

<script setup>
const getProfileIdFromRoute = () => {
  return useRoute().params.id;
};
console.log(getProfileIdFromRoute());
</script>
