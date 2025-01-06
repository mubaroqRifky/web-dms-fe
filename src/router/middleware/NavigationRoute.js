import router from "@/router";

class NavigationRoute {
    constructor(toFromNext) {
        const [to, from, next, shared] = toFromNext;
        this.to = to;
        this.from = from;
        this.next = next;
        this.router = router;
        this._shared = shared;
    }

    get shared() {
        return this._shared;
    }
    set shared(value) {
        Object.assign(this._shared, value);
    }
}

export default NavigationRoute;
