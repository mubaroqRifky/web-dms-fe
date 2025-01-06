import BaseApi from "./BaseApi";

class Dashboard extends BaseApi {
    static async index() {
        const data = await super.get("dashboard");
        return data;
    }
}

export default Dashboard;
