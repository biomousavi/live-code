import { createApp } from "vue";
import { createPinia } from "pinia";

import "./assets/main.css";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "@dotlottie/player-component";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount("#app");
