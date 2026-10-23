<script setup>
import { computed } from "vue";

const props = defineProps({
  height: { type: Number, required: true },
  backColor: { type: String, required: true },
  frontColor: { type: String, required: true },
});

const PINE = "M20 0L27 20L23 19L31 38L26 37L35 58L29 57L39 80L22 78L22 100L18 100L18 78L1 80L11 57L5 58L14 37L9 38L17 19L13 20Z";

// [x, y, scale]
const backRow = [[6, 40, 0.8], [62, 36, 0.84], [118, 40, 0.8], [172, 34, 0.86], [230, 40, 0.8], [286, 36, 0.84], [340, 40, 0.8], [380, 36, 0.84]];
const frontRow = [[-4, 5, 1.15], [52, 22, 0.98], [98, 2, 1.18], [162, 18, 1.02], [212, 6, 1.14], [276, 24, 0.96], [322, 0, 1.2], [376, 16, 1.04]];

// The 400×120 strip is repeated side by side (centered) so wide screens get more trees, not bigger ones
const TILES = 7;
const MIDDLE = Math.floor(TILES / 2);
const tileWidth = computed(() => (props.height * 400) / 120);
</script>

<template>
  <div class="forest" aria-hidden="true" :style="{ height: `${height}px` }">
    <svg
        v-for="tile in TILES"
        :key="tile"
        viewBox="0 0 400 120"
        :width="tileWidth"
        :height="height"
    >
      <g :fill="backColor">
        <path v-for="([x, y, s], i) in backRow" :key="i" :d="PINE" :transform="`translate(${x} ${y}) scale(${s})`" />
      </g>
      <!-- a wolf watching from between the trees -->
      <g v-if="tile - 1 === MIDDLE" class="eyes" fill="var(--eyes)">
        <path transform="translate(150.5 86)" d="M-4.6 -1.6L4.2 0.5L-0.6 1.5Z" />
        <path transform="translate(163.5 86)" d="M4.6 -1.6L-4.2 0.5L0.6 1.5Z" />
      </g>
      <g :fill="frontColor">
        <path v-for="([x, y, s], i) in frontRow" :key="i" :d="PINE" :transform="`translate(${x} ${y}) scale(${s})`" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.forest {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.forest svg {
  flex: none;
}

.eyes {
  filter: drop-shadow(0 0 2px rgba(255, 200, 61, 0.95));
}
</style>
