import UserIndex from "@/views/pages/master/user/UserIndex.vue";
import FormUser from "@/views/pages/master/user/FormUser.vue";

import RoleIndex from "@/views/pages/master/role/RoleIndex.vue";
import FormRole from "@/views/pages/master/role/FormRole.vue";

import PermissionIndex from "@/views/pages/master/permission/PermissionIndex.vue";
import FormPermission from "@/views/pages/master/permission/FormPermission.vue";

import CategoryIndex from "@/views/pages/master/category/CategoryIndex.vue";
import FormCategory from "@/views/pages/master/category/FormCategory.vue";

export default [
    {
        path: "/master",
        name: "master",
        redirect: { name: "master-user" },
        meta: {
            parent: "master",
            hasChild: true,
            needAuth: true,
        },
    },

    {
        path: "/master/user",
        name: "master-user",
        component: UserIndex,
        meta: {
            parent: "master",
            permit: ["USER_VIEW_LIST"],
            title: "User",
            needAuth: true,
        },
    },
    {
        path: "/master/user/create",
        name: "master-user-create",
        component: FormUser,
        meta: {
            parent: "master",
            permit: ["USER_ADD"],
            title: "User",
            needAuth: true,
        },
    },
    {
        path: "/master/user/:id/edit",
        name: "master-user-edit",
        component: FormUser,
        meta: {
            parent: "master",
            permit: ["USER_EDIT"],
            title: "User",
            needAuth: true,
        },
    },
    {
        path: "/master/user/:id",
        name: "master-user-show",
        component: FormUser,
        meta: {
            parent: "master",
            permit: ["USER_VIEW_DETAIL"],
            title: "User",
            needAuth: true,
        },
    },

    {
        path: "/master/role",
        name: "master-role",
        component: RoleIndex,
        meta: {
            parent: "master",
            permit: ["ROLE_VIEW_LIST"],
            title: "Role",
            needAuth: true,
        },
    },
    {
        path: "/master/role/create",
        name: "master-role-create",
        component: FormRole,
        meta: {
            parent: "master",
            permit: ["ROLE_CREATE"],
            title: "Role",
            needAuth: true,
        },
    },
    {
        path: "/master/role/:id/edit",
        name: "master-role-edit",
        component: FormRole,
        meta: {
            parent: "master",
            permit: ["ROLE_UPDATE"],
            title: "Role",
            needAuth: true,
        },
    },
    {
        path: "/master/role/:id",
        name: "master-role-show",
        component: FormRole,
        meta: {
            parent: "master",
            permit: ["ROLE_VIEW_DETAIL"],
            title: "Role",
            needAuth: true,
        },
    },

    {
        path: "/master/permission",
        name: "master-permission",
        component: PermissionIndex,
        meta: {
            parent: "master",
            permit: ["PERMISSION_VIEW_LIST"],
            title: "Permission",
            needAuth: true,
        },
    },
    {
        path: "/master/permission/create",
        name: "master-permission-create",
        component: FormPermission,
        meta: {
            parent: "master",
            permit: ["PERMISSION_CREATE"],
            title: "Permission",
            needAuth: true,
        },
    },
    {
        path: "/master/permission/:id/edit",
        name: "master-permission-edit",
        component: FormPermission,
        meta: {
            parent: "master",
            permit: ["PERMISSION_UPDATE"],
            title: "Permission",
            needAuth: true,
        },
    },
    {
        path: "/master/permission/:id",
        name: "master-permission-show",
        component: FormPermission,
        meta: {
            parent: "master",
            permit: ["PERMISSION_VIEW_DETAIL"],
            title: "Permission",
            needAuth: true,
        },
    },

    {
        path: "/master/category",
        name: "master-category",
        component: CategoryIndex,
        meta: {
            parent: "master",
            title: "Category",
            needAuth: true,
        },
    },
    {
        path: "/master/category/create",
        name: "master-category-create",
        component: FormCategory,
        meta: {
            parent: "master",
            title: "Category",
            needAuth: true,
        },
    },
    {
        path: "/master/category/:id/edit",
        name: "master-category-edit",
        component: FormCategory,
        meta: {
            parent: "master",
            title: "Category",
            needAuth: true,
        },
    },
    {
        path: "/master/category/:id",
        name: "master-category-show",
        component: FormCategory,
        meta: {
            parent: "master",
            title: "Category",
            needAuth: true,
        },
    },
];
