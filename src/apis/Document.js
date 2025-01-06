import BaseApi from "./BaseApi";

class Document extends BaseApi {
    static async getAll(params) {
        const data = await super.get("document/search", { params });
        return data;
    }
    static async getAllDownload(params) {
        const data = await super.get("reqdownload", {
            params,
        });
        return data;
    }
    static async searchAdvance(params) {
        const data = await super.get("document/searchdocument", {
            params,
        });
        return data;
    }
    static async getDataSearchAdvance(params) {
        const data = await super.get("document/resultsearch", {
            params,
        });
        return data;
    }
    static async store(payload) {
        const data = await super.post("upload/store", payload, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    }
    static async getListFilterDokumen(params) {
        const data = await super.get("document", {
            params,
        });
        return data;
    }
    static async getListOption(params) {
        const data = await super.get("upload", {
            params,
        });
        return data;
    }
    static async getListCompany(params) {
        const data = await super.get("document/list_company", {
            params,
        });
        return data;
    }
    static async getListPlant(params) {
        const data = await super.get("upload/plant", {
            params,
        });
        return data;
    }
    static async getListTag(params) {
        const data = await super.get("document/tagging", {
            params,
        });
        return data;
    }
    static async getReffData(reff, params) {
        if (!reff) throw new Error("No Reff Data");
        const data = await super.get("" + reff, {
            params,
        });
        return data;
    }
    static async showData(id) {
        const data = await super.get("document/show?dokumen_id=" + id);
        return data;
    }
    static async updateData(id, payload) {
        const data = await super.post("document/" + id, payload, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    }
    static async deleteData(id) {
        const data = await super.delete("document/" + id);
        return data;
    }
    static async deleteMultiple(params) {
        const data = await super.get("upload/deletefile_arr", { params });
        return data;
    }
    static async download(params) {
        const data = await super.get("upload/download_arr", {
            params,
            responseType: "blob",
        });
        return data;
    }
    static async pindahGudang(payload) {
        const data = await super.post("upload/movefile_arr", payload);
        return data;
    }
    static async requestDownload(params) {
        const data = await super.get("upload/reqdownload_arr", { params });
        return data;
    }
    static async approveDownload(payload) {
        const data = await super.post("reqdownload/update", payload);
        return data;
    }
    static async approveDocument(payload) {
        const data = await super.post("document/store", payload);
        return data;
    }
    static async viewFile(params) {
        const data = await super.get("upload/download", {
            params,
            responseType: "blob",
        });
        return data;
    }
}

export default Document;
