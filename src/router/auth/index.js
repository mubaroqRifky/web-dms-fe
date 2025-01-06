import LoginIndex from "@/views/auth/LoginIndex.vue";
import NotFoundPage from "@/views/errors/404.vue";
import UnauthorizedPage from "@/views/errors/401.vue";

export default [
    {
        path: "/login",
        name: "login",
        component: LoginIndex,
        meta: {},
    },
    {
        path: "/unauthorized",
        name: "unauthorized",
        component: UnauthorizedPage,
        meta: {},
    },
    {
        path: "/:pathMatch(.*)",
        name: "not-found",
        component: NotFoundPage,
        meta: {},
    },
];
