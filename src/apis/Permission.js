import BaseApi from "./BaseApi";

class Permission extends BaseApi {
    static async getAll(params) {
        const data = await super.get("/permission", { params });
        return data;
    }

    static async getData(id) {
        const data = await super.get("/permission/" + id);
        return data;
    }

    static async createData(payload) {
        const data = await super.post("/permission", payload);
        return data;
    }

    static async updateData(id, payload) {
        const data = await super.put("/permission/" + id, payload);
        return data;
    }

    static async deleteData(id) {
        const data = await super.delete("/permission/" + id);
        return data;
    }
}

export default Permission;
