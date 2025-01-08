export default {
    namespaced: true,

    state: {
        user_detail: null,
    },

    getters: {
        user_detail(state) {
            return state.user_detail;
        },
    },

    mutations: {
        SET_USER_DETAIL(state, user_detail) {
            state.user_detail = user_detail;
        },
        REMOVE_USER_DETAIL(state) {
            state.user_detail = null;
        },
    },

    actions: {
        setUserDetail({ commit }, user_detail) {
            commit("SET_USER_DETAIL", user_detail);
        },
        removeUserDetail({ commit }) {
            commit("REMOVE_USER_DETAIL");
        },
    },
};
