import BaseApi from "./BaseApi";

class Role extends BaseApi {
    static async getAll(params) {
        const data = await super.get("/role", { params });
        return data;
    }

    static async getData(id) {
        const data = await super.get("/role/" + id);
        return data;
    }

    static async createData(payload) {
        const data = await super.post("/role", payload);
        return data;
    }

    static async updateData(id, payload) {
        const data = await super.put("/role/" + id, payload);
        return data;
    }

    static async deleteData(id) {
        const data = await super.delete("/role/" + id);
        return data;
    }

    static async syncPermission(payload) {
        const data = await super.post("/role/sync/permission", payload);
        return data;
    }
}

export default Role;
