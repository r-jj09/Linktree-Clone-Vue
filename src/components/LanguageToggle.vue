<script setup>
import { computed } from "vue";
import { useLang } from "../composables/useLang";

const { lang, setLang } = useLang();

const isEn = computed({
  get: () => lang.value === "en",
  set: (val) => setLang(val ? "en" : "hu"),
});
</script>

<template>
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
}

button {
  background: none;
  border: none;
  color: white;
  opacity: 0.5;
  font-weight: 600;
  cursor: pointer;
}

button.active {
  opacity: 1;
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
