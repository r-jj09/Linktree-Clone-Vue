import { computed, ref } from "vue";
import en from "../locales/en";
import hu from "../locales/hu";

const lang = ref("en");

const messages = computed(() => (lang.value === "hu" ? hu : en));

function setLang(l) {
    lang.value = l;
}

export function useLang() {
    return { lang, messages, setLang };
}
