import Modal from "@/controllers/state/ModalController";

export default class UnauthorizedException extends Error {
    constructor(error) {
        super(error);
    }

    static run(error) {
        if (window.router) {
            window.$errordata = error;
            window.router.push({ name: "unauthorized", replace: true });
        } else {
            Modal.error({
                content: error.name,
                subcontent: error.message,
            });
        }
    }
}
