import Modal from "@/controllers/state/ModalController";

export default class DefaultException extends Error {
    constructor(error) {
        super(error);
    }

    static run(error = {}) {
        Modal.error({
            content: error.name || "Error Uncaught",
            subcontent: error.message || "Something went wrong!",
        });
    }
}
