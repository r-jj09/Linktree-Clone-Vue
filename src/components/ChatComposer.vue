<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Send } from "lucide-vue-next";

// Purely decorative: the wolf keeps typing little emoji messages, then sends them or thinks better of it
const MESSAGES = [
  { text: "🐺💚🌙", send: true },
  { text: "awoo~ 🐺", send: false },
  { text: "🐾🐾🐾", send: true },
  { text: "🌲🌙🌲", send: false },
  { text: "💚✨💚", send: true },
];

const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

const text = ref(reduceMotion ? MESSAGES[0].text : "");
const sending = ref(false);

let timer;
let alive = true;
const wait = (ms) => new Promise((resolve) => (timer = setTimeout(resolve, ms)));

async function loop() {
  await wait(4000); // let the chat intro play first
  for (let i = 0; alive; i = (i + 1) % MESSAGES.length) {
    // Array.from splits by code point, so emojis are typed whole
    const { text: message, send } = MESSAGES[i];
    const chars = Array.from(message);
    for (let c = 1; c <= chars.length && alive; c++) {
      text.value = chars.slice(0, c).join("");
      await wait(160 + Math.random() * 120);
    }
    await wait(1400);
    if (send) {
      sending.value = true;
      await wait(250);
      text.value = "";
      sending.value = false;
    } else {
      // backspace it away, a little quicker than it was typed
      for (let c = chars.length - 1; c >= 0 && alive; c--) {
        text.value = chars.slice(0, c).join("");
        await wait(70 + Math.random() * 40);
      }
    }
    await wait(1000);
  }
}

onMounted(() => {
  if (!reduceMotion) loop();
});

onBeforeUnmount(() => {
  alive = false;
  clearTimeout(timer);
});
</script>

<template>
  <footer class="composer flex items-center" aria-hidden="true">
    <div class="field">
      <span class="typed">{{ text }}</span><span class="caret"></span>
    </div>
    <span class="send" :class="{ sending }">
      <Send :stroke-width="2.6" />
    </span>
  </footer>
</template>

<style scoped>
.composer {
  gap: 12px;
  /* side padding keeps the content in the same 640px column as the chat */
  padding: 16px max(18px, calc(50% - 302px)) 24px;
  background: var(--panel);
  border-top: 3px solid var(--accent);
}

.field {
  flex: 1;
  min-height: 52px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-radius: 26px;
  background: var(--bg);
  border: 2px solid var(--input-border);
  color: var(--muted);
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
}

.caret {
  width: 2px;
  height: 1.2em;
  margin-left: 2px;
  background: var(--accent);
  animation: blink 1s steps(1) infinite;
}

.send {
  width: 52px;
  height: 52px;
  flex: none;
  border-radius: 50%;
  background: var(--accent);
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform .15s ease-out, background-color .15s;
}

.send.sending {
  transform: scale(0.85) rotate(-12deg);
  background-color: var(--text);
}

.send svg {
  width: 22px;
  height: 22px;
}

@keyframes blink {
  50% { opacity: 0; }
}

@media (min-width: 40rem) {
  .composer {
    gap: 14px;
    padding: 20px max(32px, calc(50% - 288px)) 28px;
  }

  .field {
    min-height: 56px;
    padding: 0 26px;
    border-radius: 28px;
    font-size: 20px;
  }

  .send {
    width: 56px;
    height: 56px;
  }

  .send svg {
    width: 24px;
    height: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .caret { animation: none; }
}
</style>
