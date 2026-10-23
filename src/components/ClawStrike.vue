<script setup>
defineProps({
  // center of the clicked bubble, in px relative to the chat column
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const SIZE = 130;
const SLASH = "M6 0L11 14L10 22L17 38L16 48L25 68L24 78L35 98L36 108L47 120L64 134L52 118L50 106L40 90L40 80L31 64L30 54L22 40L22 30L15 16L14 8Z";
// [transform, delay (s)]
const slashes = [["translate(0 4) scale(1 0.94)", 0], ["translate(34 -4) scale(1 1.06)", 0.06], ["translate(68 6) scale(1 0.9)", 0.12]];
</script>

<!-- The big green claw slash, played once over the clicked link bubble -->
<template>
  <svg
      aria-hidden="true"
      class="claw-strike"
      viewBox="-6 -10 136 150"
      :width="SIZE"
      :height="SIZE"
      :style="{ left: `${x - SIZE / 2}px`, top: `${y - SIZE / 2}px` }"
  >
    <g class="shake">
      <g v-for="([transform, delay], i) in slashes" :key="i" :transform="transform">
        <g class="slash" :style="{ animationDelay: `${delay}s` }"><path :d="SLASH" /></g>
      </g>
      <g class="slash" style="animation-delay: 0.18s">
        <path d="M-2 96L3 92L4 98Z" />
        <path d="M92 112L98 109L98 115Z" />
        <path d="M58 8L62 4L63 9Z" />
        <path d="M118 70L121 78L118 79Z" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.claw-strike {
  position: absolute;
  z-index: 2;
  pointer-events: none;
  overflow: visible;
  filter: drop-shadow(0 0 5px rgba(61, 220, 132, 0.55));
}

.slash {
  clip-path: inset(0 0 100% 0);
  fill: var(--text);
  animation: slashin 1.4s ease-in both;
}

.shake {
  animation: shake 1.4s linear both;
}

@keyframes slashin {
  0% { clip-path: inset(0 0 100% 0); fill: var(--text); opacity: 1; }
  8% { clip-path: inset(0 0 0 0); fill: var(--text); opacity: 1; }
  20% { fill: var(--accent); }
  65% { clip-path: inset(0 0 0 0); fill: var(--accent); opacity: 1; }
  100% { clip-path: inset(0 0 0 0); fill: var(--accent); opacity: 0; }
}

@keyframes shake {
  0% { transform: translate(0, 0); }
  6% { transform: translate(4px, -3px); }
  12% { transform: translate(-4px, 3px); }
  18% { transform: translate(3px, 2px); }
  24% { transform: translate(-2px, -2px); }
  30%, 100% { transform: translate(0, 0); }
}
</style>
