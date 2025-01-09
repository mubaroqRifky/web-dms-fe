import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import RouteMiddleware from "./middleware";

const RouterApp = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: () => ({ top: 0 }),
});

RouterApp.beforeEach(RouteMiddleware.build);
export default RouterApp;
