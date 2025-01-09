import AuthException from "@/exceptions/AuthException";
import { jwtVerify } from "@/helpers/JwtDecode";

export default class User {
    static get() {
        try {
            const token = $cookies.get("__Key-AUTH");
            if (token) {
                const tokenParse = jwtVerify(token);
                const { user = {}, sub, roles, permissions } = tokenParse;

                user.id = sub;
                user.roles = roles;
                user.permissions = permissions;

                return user;
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    static async set(token) {
        try {
            $cookies.set("__Key-AUTH", token);
        } catch (error) {
            throw new AuthException(error);
        }
    }

    static remove() {
        try {
            $cookies.remove("__Key-AUTH");
        } catch (error) {
            throw new AuthException(error);
        }
    }

    static canAccessRoute = (to) => {
        let { permit } = to.meta;

        if (!permit || !permit.length || this.isAdmin) return true;

        if (typeof permit == "string") permit = [permit];

        permit = permit.reduce((prev, curr) => {
            prev[curr] = true;
            return prev;
        }, {});

        const user = User.get();
        const { permissions = [], roles = [] } = user || {};
        const authority = [...permissions, ...roles];

        const canAccess = authority.find((val) => val in permit);
        return canAccess;
    };

    static get isAdmin() {
        const { roles = [] } = this.get() || {};
        return roles.includes("ADMINISTRATOR");
    }
}
