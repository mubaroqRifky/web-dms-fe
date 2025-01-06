import BaseApi from "./BaseApi";

class Authenticate extends BaseApi {
    // /login/google
    // /login

    static async login(payload) {
        const data = await super.post("login?type=google&web=true", payload);
        return data;
    }

    static async loginManual(payload) {
        const data = await super.post("login?web=true", payload);
        return data;
    }

    static async logout() {
        const data = await super.post("/logout");
        return data;
    }
}

export default Authenticate;
