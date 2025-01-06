import store from "@/store";
import { SIDEBAR } from "@/store/states/sidebarState";

export default class Sidebar {
    static get() {
        return store.getters.sidebar || {};
    }

    static open() {
        store.dispatch(SIDEBAR.ACTION, {
            type: SIDEBAR.OPEN,
        });
    }

    static view(view) {
        store.dispatch(SIDEBAR.ACTION, {
            type: SIDEBAR.VIEW,
            payload: { view },
        });
    }

    static close() {
        store.dispatch(SIDEBAR.ACTION, {
            type: SIDEBAR.CLOSE,
        });
    }
}
