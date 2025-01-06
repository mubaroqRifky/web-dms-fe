import AxiosPlugin from "./axios";
import VueCookies from "vue-cookies";
import ErrorHandler from "@/exceptions/ErrorHandler";
import AuthPlugin from "./auth";

export default {
    AxiosPlugin,
    VueCookies,
    AuthPlugin,
};

window.__proto__.ErrorHandler = ErrorHandler;
