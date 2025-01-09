import { shallowRef } from "vue";

import IconMenuHome from "@/components/icons/menu/IconMenuHome.vue";
import IconMenuDocs from "@/components/icons/menu/IconMenuDocs.vue";
import IconMenuUpload from "@/components/icons/menu/IconMenuUpload.vue";
import IconMenuAdvanceSearch from "@/components/icons/menu/IconMenuAdvanceSearch.vue";
import IconMenuReqDownload from "@/components/icons/menu/IconMenuReqDownload.vue";

import IconMenuMaster from "@/components/icons/menu/IconMenuMaster.vue";
import IconMenuUser from "@/components/icons/menu/IconMenuUser.vue";
import IconMenuCategory from "@/components/icons/menu/IconMenuCategory.vue";
import IconMenuRole from "@/components/icons/menu/IconMenuRole.vue";
import IconMenuPermission from "@/components/icons/menu/IconMenuPermission.vue";

export default [
    {
        text: "Dashboard",
        link: "/dashboard",
        icon: shallowRef(IconMenuHome),
        name: "dashboard",
    },
    {
        text: "Upload Dokumen",
        link: "/upload-document",
        icon: shallowRef(IconMenuUpload),
        name: "upload-document",
        permit: ["DOCUMENT_UPLOAD"],
    },
    {
        text: "Daftar Dokumen",
        link: "/document",
        icon: shallowRef(IconMenuDocs),
        name: "document",
        permit: ["DOCUMENT_READ"],
    },
    {
        text: "Advance Search",
        link: "/advance-search",
        icon: shallowRef(IconMenuAdvanceSearch),
        name: "advance-search",
    },
    {
        text: "Request Download",
        link: "/request-download",
        icon: shallowRef(IconMenuReqDownload),
        name: "request-download",
        permit: ["REQUEST_DOWNLOAD"],
    },
    {
        text: "Master",
        icon: shallowRef(IconMenuMaster),
        name: "master",
        child: [
            {
                text: "User",
                link: "/master/user",
                icon: shallowRef(IconMenuUser),
                name: "master-user",
                permit: [
                    "USER_ADD",
                    "USER_ASSIGN_PERMISSION",
                    "USER_ASSIGN_ROLE",
                    "USER_DEACTIVE",
                    "USER_EDIT",
                ],
            },
            {
                text: "Role",
                link: "/master/role",
                icon: shallowRef(IconMenuRole),
                name: "master-role",
                permit: [
                    "ROLE_CREATE",
                    "ROLE_UPDATE",
                    "ROLE_VIEW_LIST",
                    "ROLE_VIEW_DETAIL",
                    "ROLE_ASSIGN_PERMISSION",
                ],
            },
            {
                text: "Permission",
                link: "/master/permission",
                icon: shallowRef(IconMenuPermission),
                name: "master-permission",
                permit: [
                    "PERMISSION_CREATE",
                    "PERMISSION_UPDATE",
                    "PERMISSION_VIEW_LIST",
                    "PERMISSION_VIEW_DETAIL",
                ],
            },
        ],
    },
];
