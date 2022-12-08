import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "index",
      component: HomeView,
    },
  ],
});

export default router;
