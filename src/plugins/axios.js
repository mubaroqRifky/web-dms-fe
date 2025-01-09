import Axios from "axios";
import { client } from "laravel-precognition-vue";

const url_api = import.meta.env.VITE_API_URL || window.location.origin;

Axios.defaults.baseURL = url_api + "/api/";
Axios.defaults.headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
};

Axios.interceptors.request.use(function (cfg) {
    const token = $cookies.get("__Key-AUTH");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

client.use(Axios);

export default {
    install(app) {
        app.config.globalProperties.$http = Axios;
    },
};
