import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import store from "./store";
import plugins from "./plugins";
import components from "./components";

import "vue3-easy-data-table/dist/style.css";
import "vue-select/dist/vue-select.css";
import "@vuepic/vue-datepicker/dist/main.css";

import "./assets/css/main.css";
import "./assets/scss/main.scss";

const app = createApp(App);
app.use(router);
app.use(store);

for (const key in plugins) app.use(plugins[key]);
for (const key in components) app.component(key, components[key]);

router.isReady().then(() => {
    app.mount("#app");
});
