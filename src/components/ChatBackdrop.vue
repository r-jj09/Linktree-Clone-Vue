<script setup>
import PawPrint from "./PawPrint.vue";

// A trail of paw prints walking up the right edge of the chat.
const PAW_SCALE = 1.5 * 1.4;
// [x, y, rotation, delay (s)]
const paws = [[346, 614, 12, 0], [296, 544, -8, 0.5], [346, 474, 14, 1], [296, 404, -6, 1.5], [346, 336, 12, 2], [330, 102, -10, 2.5], [350, 34, 10, 3]];
</script>

<template>
  <svg aria-hidden="true" class="backdrop" viewBox="0 0 390 680">
    <g fill="var(--paw)">
      <g v-for="([x, y, r, delay], i) in paws" :key="i" class="pw" :style="{ animationDelay: `${delay}s` }">
        <g :transform="`translate(${x} ${y}) rotate(${r}) scale(${PAW_SCALE})`">
          <PawPrint />
        </g>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.backdrop {
  position: absolute;
  z-index: -1;
  right: 0;
  top: 0;
  width: 390px;
  height: 680px;
}

.pw {
  transform-box: fill-box;
  transform-origin: center;
  opacity: 0;
  animation: pawin 8s ease-out infinite both;
}

@keyframes pawin {
  0% { opacity: 0; transform: scale(0.4); }
  6% { opacity: 1; transform: scale(1); }
  78% { opacity: 1; transform: scale(1); }
  90%, 100% { opacity: 0; transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .pw { animation: none; opacity: 1; }
}
</style>
