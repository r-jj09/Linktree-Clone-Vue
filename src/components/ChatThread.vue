<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import socialLinks from "../data/socialLinks.json";
import { socialIcons } from "../icons/socialIcons";
import { useLang } from "../composables/useLang";
import ChatBackdrop from "./ChatBackdrop.vue";
import ClawStrike from "./ClawStrike.vue";
import ForestScene from "./ForestScene.vue";
import PawPrint from "./PawPrint.vue";

const { messages: m, lang } = useLang();

const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

const visibleLinks = computed(() =>
    socialLinks.filter((link) => (link.visibleIn ?? ["hu", "en"]).includes(lang.value))
);

// Personal links first, then work, as one conversation
const links = computed(() => [
  ...visibleLinks.value.filter((l) => l.category === "personal"),
  ...visibleLinks.value.filter((l) => l.category === "work"),
]);

const label = (link) => m.value.social?.[link.id] ?? link.id;

// Quoted, because small SVGs are inlined as data: URLs
const iconStyle = (link) => ({ "--icon": `url("${socialIcons[link.id]}")` });

// Two text messages, then one bubble per link
const total = computed(() => 2 + links.value.length);

// step n: the first n messages are shown, message n+1 is "typing"
const step = ref(reduceMotion ? Infinity : 0);
const shown = computed(() => Math.min(step.value, total.value));
const isShown = (i) => shown.value > i;
const isTyping = (i) => shown.value === i;

const GAPS = [900, 1100, 900];
const LINK_GAP = 600;
let timer;

function playNext() {
  if (step.value >= total.value) return;
  timer = setTimeout(() => {
    step.value++;
    playNext();
  }, GAPS[step.value] ?? LINK_GAP);
}

onMounted(() => {
  if (!reduceMotion) playNext();
});

onBeforeUnmount(() => clearTimeout(timer));

// Switching language can change the link count; if the intro already finished, show everything
watch(total, (now, before) => {
  if (step.value >= before) step.value = now;
});

// Claw slash across the clicked bubble, then open the link
const columnEl = ref(null);
const slashingId = ref(null);
// { n, x, y }: n remounts the claw so it replays on every click
const strike = ref(null);

function slash(event, link) {
  if (reduceMotion || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (slashingId.value) return;
  slashingId.value = link.id;
  const bubble = event.currentTarget.getBoundingClientRect();
  const column = columnEl.value.getBoundingClientRect();
  strike.value = {
    n: (strike.value?.n ?? 0) + 1,
    x: bubble.left - column.left + bubble.width / 2,
    y: bubble.top - column.top + bubble.height / 2,
  };
  setTimeout(() => {
    slashingId.value = null;
    window.open(link.url, "_blank", "noopener");
  }, 420);
}
</script>

<template>
  <div class="chat">
    <ForestScene :height="150" back-color="#153322" front-color="#102a1e" />
    <div ref="columnEl" class="chat-inner flex flex-col items-start">
      <ChatBackdrop />
      <ClawStrike v-if="strike" :key="strike.n" :x="strike.x" :y="strike.y" />

      <div v-for="(text, i) in [m.chat.greeting, m.chat.intro]" :key="`msg-${i}`" class="slot text-slot">
        <div class="typing" :class="isTyping(i) ? 'on' : 'off'" aria-hidden="true">
          <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
        </div>
        <p class="msg text-bubble" :class="isShown(i) ? 'on' : 'off'">
          <Transition name="lang" mode="out-in">
            <span :key="lang" class="lang-text" :style="{ '--i': i + 1 }">{{ text }}</span>
          </Transition>
        </p>
      </div>

      <div v-for="(link, i) in links" :key="link.id" class="slot">
        <div class="typing" :class="isTyping(i + 2) ? 'on' : 'off'" aria-hidden="true">
          <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
        </div>
        <a
            :href="link.url"
            :aria-label="`${label(link)} (opens in a new tab)`"
            target="_blank"
            rel="noopener noreferrer"
            class="msg link-bubble"
            :class="[isShown(i + 2) ? 'on' : 'off', { slashing: slashingId === link.id }]"
            @click="slash($event, link)"
        >
          <span class="link-icon">
            <span
                v-if="socialIcons[link.id]"
                class="icon-glyph"
                aria-hidden="true"
                :style="iconStyle(link)"
            ></span>
          </span>
          <Transition name="lang" mode="out-in">
            <span :key="lang" class="lang-text" :style="{ '--i': i + 3 }">{{ label(link) }}</span>
          </Transition>
          <svg class="clawfx" aria-hidden="true" viewBox="0 0 120 60" preserveAspectRatio="none">
            <g fill="var(--ink)">
              <path class="cut" d="M6 -2Q36 26 50 62Q28 30 6 -2Z" />
              <path class="cut" d="M42 -2Q72 26 86 62Q64 30 42 -2Z" />
              <path class="cut" d="M78 -2Q108 26 122 62Q100 30 78 -2Z" />
            </g>
          </svg>
        </a>
      </div>

      <!-- The wolf keeps typing... -->
      <div class="typing-end flex items-center" :class="shown >= total ? 'on' : 'off'" aria-hidden="true">
        <div class="typing-bubble">
          <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
        </div>
        <!--        <svg class="end-paw" viewBox="-11 -13 22 24" fill="var(&#45;&#45;bubble-border)">
                  <PawPrint />
                </svg>-->
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  flex: 1;
}

/* Content column, centered on wide screens; the forest stays full width */
.chat-inner {
  position: relative;
  width: 100%;
  max-width: 640px;
  box-sizing: border-box;
  margin: 0 auto;
  gap: 14px;
  padding: 26px 18px 24px;
}

.slot {
  position: relative;
  display: grid;
  align-items: center;
  justify-items: start;
}

.slot > * {
  grid-area: 1 / 1;
}

.text-slot {
  max-width: 82%;
}

.typing,
.typing-bubble {
  display: flex;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 20px 20px 20px 4px;
  background: var(--bubble);
  border: 2px solid var(--bubble-border);
  transition: opacity .2s;
}

.typing-end {
  position: relative;
  gap: 14px;
  transition: opacity .2s;
}

.typing.off,
.typing-end.off {
  opacity: 0;
}

.end-paw {
  width: 42px;
  height: 46px;
  transform: rotate(18deg);
}

.msg {
  transition: opacity .35s ease-out, transform .35s cubic-bezier(.2, 1.3, .4, 1), visibility .35s;
}

.msg.off {
  opacity: 0;
  transform: translateY(14px) scale(0.94);
  visibility: hidden;
}

.msg.on {
  opacity: 1;
  transform: none;
  visibility: visible;
}

.text-bubble {
  margin: 0;
  padding: 12px 16px;
  border-radius: 20px 20px 20px 4px;
  background: var(--bubble);
  border: 2px solid var(--bubble-border);
  color: var(--text);
  font-family: var(--font-marker);
  font-size: 18px;
  font-weight: 400;
  line-height: 1.3;
}

.link-bubble {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 50px;
  padding: 0 18px 0 9px;
  border-radius: 25px 25px 25px 4px;
  background: var(--accent);
  box-shadow: 4px 4px 0 var(--accent-shadow);
  color: var(--ink);
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  text-decoration: none;
  transition: opacity .35s ease-out, transform .35s cubic-bezier(.2, 1.3, .4, 1), visibility .35s, box-shadow .12s, background-color .12s;
}

.link-bubble.on:hover {
  transform: translate(-3px, -3px);
  box-shadow: 10px 10px 0 var(--accent-shadow);
  background-color: var(--text);
}

.link-bubble:focus-visible {
  outline: 3px solid var(--text);
  outline-offset: 3px;
}

.link-icon {
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 50%;
  background: var(--ink);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-glyph {
  display: block;
  width: 17px;
  height: 17px;
  /* the icon files are single-colour, so they are used as a mask and tinted with the accent */
  background: var(--accent);
  -webkit-mask: var(--icon) center / contain no-repeat;
  mask: var(--icon) center / contain no-repeat;
}

.clawfx {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
}

.cut {
  clip-path: inset(0 0 100% 0);
}

.slashing {
  animation: bubhit .34s ease-out;
}

.slashing .clawfx {
  opacity: 1;
}

.slashing .cut {
  animation: cutin .12s ease-in forwards;
}

.slashing .cut:nth-child(2) {
  animation-delay: .06s;
}

.slashing .cut:nth-child(3) {
  animation-delay: .12s;
}

@keyframes cutin {
  to { clip-path: inset(0 0 0 0); }
}

@keyframes bubhit {
  0% { filter: brightness(1.5); }
  20% { transform: translate(-3px, 2px); }
  40% { transform: translate(3px, -2px); }
  60% { transform: translate(-2px, 1px); }
  100% { transform: translate(0, 0); filter: none; }
}

@media (min-width: 40rem) {
  .chat-inner {
    gap: 18px;
    padding: 36px 32px 28px;
  }

  .text-slot {
    max-width: 460px;
  }

  .typing,
  .typing-bubble {
    gap: 7px;
    padding: 18px 20px;
    border-radius: 24px 24px 24px 4px;
    border-width: 3px;
  }

  .typing-end {
    gap: 16px;
  }

  .end-paw {
    width: 52px;
    height: 57px;
  }

  .text-bubble {
    padding: 16px 22px;
    border-radius: 24px 24px 24px 4px;
    border-width: 3px;
    font-size: 22px;
  }

  .link-bubble {
    gap: 12px;
    min-height: 58px;
    padding: 0 24px 0 11px;
    border-radius: 29px 29px 29px 4px;
    box-shadow: 6px 6px 0 var(--accent-shadow);
    font-size: 22px;
  }

  .link-icon {
    width: 36px;
    height: 36px;
  }

  .icon-glyph {
    width: 19px;
    height: 19px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .msg {
    transition: none;
  }
}
</style>
