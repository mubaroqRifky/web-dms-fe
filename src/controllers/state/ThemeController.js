import store from "@/store";
import { THEME } from "@/store/states/themeState";

export default class Theme {
    static get mode() {
        return store.getters.theme.mode;
    }

    static set(mode) {
        store.dispatch(THEME.ACTION, {
            type: THEME.SET,
            mode,
        });
    }

    static dark() {
        store.dispatch(THEME.ACTION, {
            type: THEME.DARK,
        });
    }

    static light() {
        store.dispatch(THEME.ACTION, {
            type: THEME.LIGHT,
        });
    }
}
