import BaseApi from "./BaseApi";

class User extends BaseApi {
    static async getAll(params) {
        const data = await super.get("settinguser", {
            params,
        });
        return data;
    }

    static async getData(id) {
        const data = await super.get("/user/" + id);
        return data;
    }

    static async updateData(id, payload) {
        const data = await super.put("/user/" + id, payload);
        return data;
    }

    static async syncData(key, payload) {
        const data = await super.post("/user/sync/" + key, payload);
        return data;
    }

    static async create(payload) {
        const data = await super.post("settinguser", payload);
        return data;
    }

    static async update(payload) {
        const data = await super.post("settinguser/update", payload);
        return data;
    }

    static async getAtasan(params) {
        const data = await super.get("/settinguser/get_atasanbyemail", {
            params,
        });
        return data;
    }
}

export default User;
