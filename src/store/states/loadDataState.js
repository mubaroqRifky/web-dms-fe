const LOAD = {
    MUTATION_FUNC: "load_mutation",
    ACTION: "load_action",

    START: "start",
    STOP: "stop",
};

const load_state = false;

function load(state) {
    return state.load_state;
}

function load_mutation(state, payload) {
    state.load_state = payload;
}

function load_action(state, payload) {
    dispatch_load(state, payload);
}

function dispatch_load({ commit, state }, { type, payload = false }) {
    switch (type) {
        case LOAD.START:
            commit(LOAD.MUTATION_FUNC, true);
            break;
        case LOAD.STOP:
            commit(LOAD.MUTATION_FUNC, false);
            break;
        default:
            commit(LOAD.MUTATION_FUNC, load_state);
            break;
    }
}

export { load, LOAD, load_state, load_mutation, load_action };

export default {
    state: { load_state },
    getters: { load },
    mutations: { load_mutation },
    actions: { load_action },
};
