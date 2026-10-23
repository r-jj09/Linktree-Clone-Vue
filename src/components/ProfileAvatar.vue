<script setup>
import profile from "../assets/profile.webp";

defineProps({
  size: { type: Number, default: 64 },
  border: { type: Number, default: 3 },
});
</script>

<template>
  <img
      class="profile-avatar flex-none rounded-full"
      :src="profile"
      alt="Réka's profile picture"
      :width="size"
      :height="size"
      :style="{ width: `${size}px`, height: `${size}px`, borderWidth: `${border}px` }"
  >
</template>

<style scoped>
.profile-avatar {
  position: relative;
  box-sizing: border-box;
  object-fit: cover;
  background: var(--bg);
  border-style: solid;
  border-color: var(--accent);
}
</style>
