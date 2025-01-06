import Axios from "axios";
import Loading from "@/controllers/state/LoadingController";

class BaseApi {
    static async get(url, config) {
        try {
            const { data } = await Axios.get(url, config);
            return data;
        } catch (error) {
            throw error;
        } finally {
        }
    }

    static async post(url, payload, config) {
        try {
            Loading.start();
            const { data } = await Axios.post(url, payload, config);
            return data;
        } catch (error) {
            throw error;
        } finally {
            Loading.stop();
        }
    }

    static async put(url, payload, config) {
        try {
            Loading.start();
            const { data } = await Axios.put(url, payload, config);
            return data;
        } catch (error) {
            throw error;
        } finally {
            Loading.stop();
        }
    }

    static async delete(url, config) {
        try {
            Loading.start();
            const { data } = await Axios.delete(url, config);
            return data;
        } catch (error) {
            throw error;
        } finally {
            Loading.stop();
        }
    }
}

export default BaseApi;
