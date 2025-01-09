import Authorization from "./AuthorizationController";

export default class Permission extends Authorization {
    constructor() {
        super();
        this._key = "permissions";
    }

    static get list() {
        return {
            DOCUMENT_APPROVED: "DOCUMENT_APPROVED",
            DOCUMENT_DELETE: "DOCUMENT_DELETE",
            DOCUMENT_READ: "DOCUMENT_READ",
            DOCUMENT_UPLOAD: "DOCUMENT_UPLOAD",
            DOCUMENT_REVISI: "DOCUMENT_REVISI",
            REQUEST_DOWNLOAD: "REQUEST_DOWNLOAD",
            ROLE_ASSIGN_PERMISSION: "ROLE_ASSIGN_PERMISSION",
            ROLE_CREATE: "ROLE_CREATE",
            ROLE_UPDATE: "ROLE_UPDATE",
            ROLE_VIEW_DETAIL: "ROLE_VIEW_DETAIL",
            ROLE_VIEW_LIST: "ROLE_VIEW_LIST",
            USER_ADD: "USER_ADD",
            USER_ASSIGN_PERMISSION: "USER_ASSIGN_PERMISSION",
            USER_ASSIGN_ROLE: "USER_ASSIGN_ROLE",
            USER_DEACTIVE: "USER_DEACTIVE",
            USER_EDIT: "USER_EDIT",
            PERMISSION_CREATE: "PERMISSION_CREATE",
            PERMISSION_UPDATE: "PERMISSION_UPDATE",
            PERMISSION_VIEW_DETAIL: "PERMISSION_VIEW_DETAIL",
            PERMISSION_VIEW_LIST: "PERMISSION_VIEW_LIST",
        };
    }
}
