import Permission from "@/controllers/auth/PermissionController";
import Role from "@/controllers/auth/RoleController";

export default {
    install(app) {
        const { globalProperties } = app.config;
        Object.assign(globalProperties, Permission.list, Role.list);

        globalProperties.can = (...values) => {
            const authPermission = new Permission();
            return authPermission.ability(values);
        };

        globalProperties.role = (...values) => {
            const authRole = new Role();
            return authRole.ability(values);
        };
    },
};
