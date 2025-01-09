import AuthException from "@/exceptions/AuthException";
import { jwtVerify } from "@/helpers/JwtDecode";

export default class UserGoogle {
    static get() {
        try {
            const token = $cookies.get("__Token-Google");
            if (token) {
                const tokenParse = jwtVerify(token);
                return tokenParse;
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    static async set(token) {
        try {
            $cookies.set("__Token-Google", token);
        } catch (error) {
            throw new AuthException(error);
        }
    }

    static remove() {
        try {
            $cookies.remove("__Token-Google");
        } catch (error) {
            throw new AuthException(error);
        }
    }
}
