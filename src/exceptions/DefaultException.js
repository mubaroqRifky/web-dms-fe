import Modal from "@/controllers/state/ModalController";

export default class DefaultException extends Error {
    constructor(error) {
        super(error);
    }

    static run(error = {}) {
        const content = error.data?.exception || error.name || "Error Uncaught";
        const subcontent = error.message || "Something went wrong!";

        Modal.error({ content, subcontent });
    }
}
