<script setup>
import { onMounted, watch } from "vue";
import ProfileHeader from "./components/ProfileHeader.vue";
import ChatThread from "./components/ChatThread.vue";
import ChatComposer from "./components/ChatComposer.vue";
import LanguageToggle from "./components/LanguageToggle.vue";
import { useLang } from "./composables/useLang";


const { lang, messages: m } = useLang();

const setMeta = (selector, content) => {
  document.head.querySelector(selector)?.setAttribute("content", content);
};

// Keep the document language, title and meta tags in step with the language toggle
const updateHead = () => {
  const meta = m.value.meta;
  document.documentElement.lang = lang.value;
  document.title = m.value.title;
  setMeta('meta[name="description"]', meta.description);
  setMeta('meta[name="author"]', m.value.name);
  setMeta('meta[property="og:title"]', meta.title);
  setMeta('meta[property="og:description"]', meta.shortDescription);
  setMeta('meta[property="og:locale"]', meta.locale);
  setMeta('meta[property="og:locale:alternate"]', lang.value === "hu" ? "en_US" : "hu_HU");
  setMeta('meta[name="twitter:title"]', meta.title);
  setMeta('meta[name="twitter:description"]', meta.shortDescription);
};

onMounted(updateHead);

watch(lang, updateHead);
</script>

<template>
  <div class="page">
    <LanguageToggle />
    <div class="frame">
      <ProfileHeader />
      <ChatThread />
      <ChatComposer />
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background: var(--bg);
}

.frame {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
