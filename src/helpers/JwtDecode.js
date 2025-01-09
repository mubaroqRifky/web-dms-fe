import AuthException from "@/exceptions/AuthException";
import { jwtDecode } from "jwt-decode";

export function jwtVerify(token) {
    try {
        const decode = jwtDecode(token);
        const exp_date = new Date(decode.exp * 1000);
        const current_date = new Date().getTime();

        if (current_date < exp_date) return decode;
        throw new AuthException("Session Timeout");
    } catch (error) {
        throw new AuthException(error);
    }
}
