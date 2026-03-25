<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import SocialPages from "./components/SocialPages.vue";
import ParticlesBackground from "./components/ParticlesBackground.vue";
import LanguageToggle from "./components/LanguageToggle.vue";
import { useLang } from "./composables/useLang";
import Typed from "typed.js";

import { Analytics } from '@vercel/analytics/vue';

const { lang, messages: m } = useLang();

const updateTitle = () => {
  document.title = m.value.title;
};

onMounted(updateTitle);

watch(lang, updateTitle);

const typedEl = ref(null);
let typedInstance;

onMounted(() => {
  if (!typedEl.value) return;

  typedInstance = new Typed(typedEl.value, {
    strings: ["@r_jj.09", "Réka", "Réjj"],
    typeSpeed: 50,
    backSpeed: 50,
    smartBackspace: true,
    loop: true,
    showCursor: true,
    cursorChar: "|",
  });
});

onBeforeUnmount(() => {
  typedInstance?.destroy();
});
</script>

<template>
  <div class="page">
    <Analytics />
    <ParticlesBackground/>
    <section class="page-content flex justify-center items-center flex-col">
      <img class="rounded-full w-[120px] h-[120px]" src="./assets/profile.webp" alt="Réka's profile picture">

      <div class="flex flex-row text-2xl p-4">
        <span ref="typedEl"></span>
      </div>
      <LanguageToggle />
      <p>{{ m.bio }}</p>


      <div class="introduction-container">
        <div class="profile-img-container">
          <img src="" alt="" />
        </div>
        <div class="introduction-text"></div>
      </div>
      <SocialPages />
    </section>
  </div>
</template>

<style scoped>
.page {
  position: relative;
  min-height: 100vh;
  overflow: hidden; /* ok here, because content is inside and still visible */
}

.page-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
}
</style>

