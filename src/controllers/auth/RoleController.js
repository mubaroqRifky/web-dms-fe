import Authorization from "./AuthorizationController";

export default class Role extends Authorization {
    constructor() {
        super();
        this._key = "roles";
    }

    static get list() {
        return {
            ADMIN: "ADMINISTRATOR",
            DOC_CONTROL: "DOC_CONTROL",
            KARYAWAN: "KARYAWAN",
            MR_MRP: "MR_MRP",
            PIC_AREA: "PIC_AREA",
            PIC_DEPT: "PIC_DEPT",
        };
    }
}
