<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import socialLinks from "../data/socialLinks.json";
import { socialIcons } from "../icons/socialIcons";
import { useLang } from "../composables/useLang";

const { messages: m, lang } = useLang();


const personalLinkEls = ref([]);
const workLinkEls = ref([]);
const personalObserverRef = ref(null);
const workObserverRef = ref(null);

const visibleLinks = computed(() =>
    socialLinks.filter((link) => (link.visibleIn ?? ["hu", "en"]).includes(lang.value))
);

const personalLinks = computed(() => visibleLinks.value.filter(l => l.category === "personal"));
const workLinks = computed(() => visibleLinks.value.filter(l => l.category === "work"));

const linkEls = ref([]);

let observer;

function setupObserver(els, observerRef, stagger = true) {
  if (observerRef.value) observerRef.value.disconnect();
  if (!("IntersectionObserver" in window)) {
    const index = els.value.indexOf(el);
    el.style.animationDelay = stagger ? `${index * 80}ms` : `0ms`;
    els.value.forEach((el) => el?.classList.add("animate-on-scroll"));
    return;
  }

  observerRef.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const index = els.value.indexOf(el);
            el.style.animationDelay = stagger ? `${index * 150}ms` : undefined;
            el.classList.add("animate-on-scroll");
            observerRef.value.unobserve(el);
          }
        });
      },
      { root: null, rootMargin: "0px 0px 200px 0px", threshold: 0 }
  );

  els.value.forEach((el) => el && observerRef.value.observe(el));
}

onMounted(async () => {
  await nextTick();
  setupObserver(personalLinkEls, personalObserverRef, true);
  setupObserver(workLinkEls, workObserverRef, false);
});

watch(visibleLinks, async () => {
  [...workLinkEls.value, ...personalLinkEls.value].forEach(el => {
    el?.classList.remove("animate-on-scroll");
    el?.style.removeProperty("animation-delay");
  });

  await nextTick();
  setupObserver(personalLinkEls, personalObserverRef, true);
  setupObserver(workLinkEls, workObserverRef, false);
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<template>
  <div class="social-container flex items-start justify-items-start flex-col w-full md:w-[50%] p-6">
    <a
        v-for="(link, i) in personalLinks"
        :key="link.id"
        :href="link.url"
        :aria-label="`${m.social?.[link.id] ?? link.id} (opens in a new tab)`"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link flex justify-center items-center flex-row gap-3 text-xl w-full p-4"
        :ref="(el) => (personalLinkEls[i] = el)"
    >
      <img
          v-if="socialIcons[link.id]"
          :src="socialIcons[link.id]"
          class="icon w-[30px] h-[30px]"
      />
      {{ m.social?.[link.id] ?? link.id }}
    </a>
  </div>
  <div class="social-container flex items-start justify-items-start flex-col md:flex-row w-full md:w-[80%] p-6 gap-3">
    <a
        v-for="(link, i) in workLinks"
        :key="link.id"
        :href="link.url"
        :aria-label="`${m.social?.[link.id] ?? link.id} (opens in a new tab)`"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link social-link-work flex justify-center items-center flex-row gap-3 text-xl w-full py-12"
        :ref="(el) => (workLinkEls[i] = el)"
    >
      <img
          v-if="socialIcons[link.id]"
          :src="socialIcons[link.id]"
          class="icon w-[30px] h-[30px]"
      />
      {{ m.social?.[link.id] ?? link.id }}
    </a>
  </div>
</template>

<style scoped>
.social-link {
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
}

</style>
