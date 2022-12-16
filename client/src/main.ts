import "./assets/main.css";
import App from "./App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "@dotlottie/player-component";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(createPinia());
app.use(Toast, { transition: "Vue-Toastification__slideBlurred" });

app.mount("#app");
