const THEME = {
    MUTATION_FUNC: "theme_mutation",
    ACTION: "theme_action",

    SET: "set",
    DARK: "dark",
    LIGHT: "light",
};

const theme_state = {
    mode: "light",
};

function theme(state) {
    return state.theme_state;
}

function theme_mutation(state, mode) {
    state.theme_state = { ...state.sidebar_state, mode };
}

function theme_action(state, payload) {
    dispatch_theme(state, payload);
}

function dispatch_theme({ commit }, { type, mode = "light" }) {
    switch (type) {
        case THEME.DARK:
            commit(THEME.MUTATION_FUNC, "dark");
            break;
        case THEME.SET:
            commit(THEME.MUTATION_FUNC, mode);
            break;
        default:
            commit(THEME.MUTATION_FUNC, "light");
            break;
    }
}

export { THEME, theme, theme_state, theme_mutation, theme_action };
