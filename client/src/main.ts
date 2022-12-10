import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import "./assets/main.css";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "@dotlottie/player-component";

const app = createApp(App);

app.use(Toast, {
  transition: "Vue-Toastification__slideBlurred",
});
app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount("#app");
