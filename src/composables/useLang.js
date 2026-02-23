import { computed, ref } from "vue";
import en from "../locales/en";
import hu from "../locales/hu";

const lang = ref(localStorage.getItem("lang") || "hu");

const messages = computed(() => (lang.value === "hu" ? hu : en));

function setLang(l) {
    lang.value = l;
    localStorage.setItem("lang", l);
}

export function useLang() {
    return { lang, messages, setLang };
}
