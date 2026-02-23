<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import socialLinks from "../data/socialLinks.json";
import { socialIcons } from "../icons/socialIcons";
import { useLang } from "../composables/useLang";

const { messages: m, lang } = useLang();

const visibleLinks = computed(() =>
    socialLinks.filter((link) => (link.visibleIn ?? ["hu", "en"]).includes(lang.value))
);

const linkEls = ref([]);

let observer;

function setupObserver() {
  if (observer) observer.disconnect();
  if (!("IntersectionObserver" in window)) {
    linkEls.value.forEach((el) => el?.classList.add("animate-on-scroll"));
    return;
  }

  observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;

            // find index for stagger
            const index = linkEls.value.indexOf(el);
            const delay = index * 80; // ms → tweak this (60–120 feels nice)

            el.style.animationDelay = `${delay}ms`;
            el.classList.add("animate-on-scroll");

            observer.unobserve(el);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0,
      }
  );

  linkEls.value.forEach((el) => el && observer.observe(el));
}

onMounted(async () => {
  await nextTick();
  setupObserver();
});

watch(visibleLinks, async () => {
  await nextTick();
  setupObserver();
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<template>
  <div class="social-container flex items-start justify-items-start flex-col w-100 p-6">
    <a
        v-for="(link, i) in visibleLinks"
        :key="link.id"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link employee-card flex justify-center items-center flex-row gap-3 text-xl"
        :ref="(el) => (linkEls[i] = el)"
    >
      <img
          v-if="socialIcons[link.id]"
          :src="socialIcons[link.id]"
          :alt="`${m.social?.[link.id] ?? link.id} icon`"
          class="icon w-[30px] h-[30px]"
      />
      {{ m.social?.[link.id] ?? link.id }}
    </a>
  </div>
</template>

<style scoped>
.employee-card {
  visibility: hidden;
  opacity: 0;
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-on-scroll {
  animation: slideUp 1s ease-out forwards;
  visibility: visible !important;
  animation-delay: var(--delay, 0ms);
}

</style>
