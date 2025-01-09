import BaseApi from "./BaseApi";

class Maintenance extends BaseApi {
    static async get() {
        const data = await super.get("/maintenance");
        return data;
    }

    static async set() {
        const data = await super.post("/maintenance");
        return data;
    }
}

export default Maintenance;
