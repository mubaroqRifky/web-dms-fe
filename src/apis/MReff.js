import BaseApi from "./BaseApi";

class MReff extends BaseApi {
    static async getDocumentName(params = {}) {
        const data = await super.get("reff", {
            params: {
                ...params,
                kd_group: "DOCUMENT_NAME",
            },
        });
        return data;
    }
    static async getDocumentLevel(params = {}) {
        const data = await super.get("reff", {
            params: {
                ...params,
                kd_group: "DOCUMENT_LEVEL",
            },
        });
        return data;
    }
}

export default MReff;
