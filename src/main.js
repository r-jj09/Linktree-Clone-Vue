import { createApp } from 'vue'
import './style.css'
import Particles from "@tsparticles/vue3";
import { loadFull } from "tsparticles";
import App from './App.vue'


const app = createApp(App);

app.use(Particles, {
    init: async (engine) => {
        await loadFull(engine);
    },
});

app.mount("#app");






































