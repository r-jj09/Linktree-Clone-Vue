<script setup>
import ProfileAvatar from "./ProfileAvatar.vue";
import StarField from "./StarField.vue";
import { useLang } from "../composables/useLang";

const { messages: m, lang } = useLang();

const SKY_TILES = 9;

const stars = [
  [30, 11, 0.9, 0, 2.6], [104, 9, 1.1, 1.2, 3.4], [172, 15, 0.9, 2.1, 2.2], [240, 8, 1.2, 0.6, 3.8],
  [296, 18, 0.9, 1.8, 2.9], [378, 12, 1, 2.5, 3.2], [52, 97, 1, 0.9, 2.4], [126, 99, 0.9, 2.7, 3.6],
  [206, 96, 1.2, 0.3, 2.8], [284, 98, 0.9, 1.5, 3.3], [352, 88, 1.1, 2.3, 2.5],
];
</script>

<!-- Profile strip above the chat -->
<template>
  <header class="profile-header">
    <div class="sky -z-10">
      <StarField
          v-for="tile in SKY_TILES"
          :key="tile"
          class="sky-tile"
          view-box="0 0 390 106"
          :stars="stars"
          :shoot="tile - 1 === Math.floor(SKY_TILES / 2)"
          :delay-offset="tile * 0.7"
      />
    </div>
    <div class="header-inner flex items-center">
      <svg class="moon" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
      <ProfileAvatar :size="64" :border="3" />
      <div class="flex flex-col items-start gap-[6px]">
        <h1 class="name">
          <Transition name="lang" mode="out-in">
            <span :key="lang" class="lang-text">{{ m.name }}</span>
          </Transition>
        </h1>
        <span class="role flex items-center gap-[7px]">
          <span class="status" aria-hidden="true"></span>
          <Transition name="lang" mode="out-in">
            <span :key="lang" class="lang-text">{{ m.role }}</span>
          </Transition>
        </span>
      </div>
    </div>
  </header>
  <div class="zigzag" aria-hidden="true"></div>
</template>

<style scoped>
.profile-header {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--panel);
}

/* Content column, centered on wide screens; the strip itself stays full width */
.header-inner {
  position: relative;
  max-width: 640px;
  box-sizing: border-box;
  margin: 0 auto;
  gap: 14px;
  padding: 22px 18px 20px;
}

/* The star field is repeated (centered) across the whole strip so it stays its phone size */
.sky {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.sky-tile {
  flex: none;
  width: 390px;
}

/* The moon stays once, at the right of the content column */
.moon {
  position: absolute;
  z-index: -1;
  top: 14px;
  right: 8px;
  width: 60px;
  height: 60px;
  fill: var(--text);
  filter: drop-shadow(0 0 6px rgba(242, 245, 243, 0.5));
}

.name {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 38px;
  line-height: 0.95;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--text);
}

.role {
  font-size: 13px;
  font-weight: 700;
  color: var(--muted-2);
}

.status {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--accent);
}

@media (min-width: 40rem) {
  .header-inner {
    gap: 18px;
    padding: 28px 32px 24px;
  }

  .name {
    font-size: 48px;
  }

  .role {
    font-size: 15px;
  }
}

.zigzag {
  height: 14px;
  background: linear-gradient(135deg, var(--panel) 50%, transparent 50%),
  linear-gradient(225deg, var(--panel) 50%, transparent 50%);
  background-size: 28px 14px;
}
</style>
