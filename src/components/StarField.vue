<script setup>
defineProps({
  viewBox: { type: String, required: true },
  aspect: { type: String, default: "xMidYMid slice" },
  // [x, y, scale, delay (s), duration (s)]
  stars: { type: Array, required: true },
  shootTail: { type: String, default: "M-50 -4.7L0 -1.6L0 1.6Z" },
  shoot: { type: Boolean, default: true },
  // shifts every twinkle, so repeated fields don't blink in sync
  delayOffset: { type: Number, default: 0 },
});

const STAR = "M0-5L1.2-1.2L5 0L1.2 1.2L0 5L-1.2 1.2L-5 0L-1.2-1.2Z";
</script>

<template>
  <svg aria-hidden="true" :viewBox="viewBox" :preserveAspectRatio="aspect" width="100%" height="100%">
    <slot />
    <g fill="var(--muted)">
      <g v-for="([x, y, s, delay, dur], i) in stars" :key="i" :transform="`translate(${x} ${y}) scale(${s})`">
        <path class="star" :style="{ animationDelay: `${delay + delayOffset}s`, animationDuration: `${dur}s` }" :d="STAR" />
      </g>
    </g>
    <g v-if="shoot" class="shoot" fill="var(--text)">
      <path :d="shootTail" />
      <circle r="1.8" />
    </g>
  </svg>
</template>
