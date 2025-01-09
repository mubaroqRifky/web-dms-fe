import { createStore } from "vuex";

import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
import state from "./state";
import modules from "./modules";

const store = createStore({
    state,
    getters,
    mutations,
    actions,
    modules,
});

export default store;
