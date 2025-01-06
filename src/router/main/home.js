import HomeIndex from "@/views/pages/home/HomeIndex.vue";
import DocumentIndex from "@/views/pages/document/DocumentIndex.vue";
import DocumentCreate from "@/views/pages/document/DocumentCreate.vue";
import DocumentEdit from "@/views/pages/document/DocumentEdit.vue";
import DocumentDetail from "@/views/pages/document/DocumentDetail.vue";
import DocumentSearch from "@/views/pages/document/DocumentSearch.vue";
import DocumentDownload from "@/views/pages/document/DocumentDownload.vue";

export default [
    {
        path: "/dashboard",
        name: "dashboard",
        component: HomeIndex,
        meta: {
            title: "Dashboard",
            needAuth: true,
        },
    },
    {
        path: "/document",
        name: "document",
        component: DocumentIndex,
        meta: {
            title: "Document",
            needAuth: true,
        },
    },
    {
        path: "/document/:id/edit",
        name: "document-edit",
        component: DocumentEdit,
        meta: {
            parent: "document",
            title: "Document Edit",
            needAuth: true,
        },
    },
    {
        path: "/document/:id",
        name: "document-show",
        component: DocumentDetail,
        meta: {
            parent: "document",
            title: "Document Detail",
            needAuth: true,
        },
    },
    {
        path: "/upload-document",
        name: "upload-document",
        component: DocumentCreate,
        meta: {
            title: "Upload Document",
            needAuth: true,
        },
    },
    {
        path: "/advance-search",
        name: "advance-search",
        component: DocumentSearch,
        meta: {
            title: "Advance Search",
            needAuth: true,
        },
    },
    {
        path: "/request-download",
        name: "request-download",
        component: DocumentDownload,
        meta: {
            title: "Request Download",
            needAuth: true,
        },
    },
];
