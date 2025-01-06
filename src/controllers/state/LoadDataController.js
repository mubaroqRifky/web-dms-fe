import store from "@/store";
import { LOAD } from "@/store/states/loadDataState";

export default class Load {
    static get() {
        return store.getters.load || false;
    }

    static start() {
        store.dispatch(LOAD.ACTION, {
            type: LOAD.START,
        });
    }

    static stop() {
        store.dispatch(LOAD.ACTION, {
            type: LOAD.STOP,
        });
    }
}
