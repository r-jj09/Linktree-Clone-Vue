<script setup>
import { computed, ref } from "vue";
import { useLang } from "../composables/useLang";
const isOpen = ref(false);

const { lang, setLang } = useLang();

const isEn = computed({
  get: () => lang.value === "en",
  set: (val) => setLang(val ? "en" : "hu"),
});

function toggleSwitcher() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <nav class="lang-bar fixed z-[10]" :style="{ right: isOpen ? '0px' : '-150px' }">
    <button class="handle flex items-center justify-items-center" @click="toggleSwitcher">
      <img class="size-full" src="/src/assets/icons/lang.svg" alt="">
    </button>
    <div class="lang-body">
      <div class="lang-toggle">
        <button
            @click="setLang('hu')"
            :class="{ active: lang === 'hu' }"
            type="button"
        >
          HU
        </button>

        <label class="switch">
          <input v-model="isEn" type="checkbox" />
          <span class="slider"></span>
        </label>

        <button
            @click="setLang('en')"
            :class="{ active: lang === 'en' }"
            type="button"
        >
          EN
        </button>
      </div>
    </div>

  </nav>
</template>

<style scoped>
.lang-toggle {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  cursor: pointer;
}

.lang-bar {
  overflow: hidden !important;
  transition: right 0.3s ease;
  right: -150px;
  top: 200px;
}

.lang-bar {
  display: flex;
  flex-direction: row;
}

.handle {
  border: none;
  align-content: center;
  background-color: var(--accent);
  padding: 5px;
  height: 35px;
  width: 45px;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
  cursor: pointer;
}

.lang-body {
  overflow: hidden !important;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(158, 145, 185, 0.5);
  padding: 10px;
  border-bottom-left-radius: 5px;
}

.switch {
  position: relative;
  width: 44px;
  height: 24px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 999px;
}

.slider::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s ease;
}

input:checked + .slider::before {
  transform: translateX(20px);
}
</style>
