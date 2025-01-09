import Modal from "@/controllers/state/ModalController";
import User from "@/controllers/auth/UserController";

export default class AuthException extends Error {
    constructor(error) {
        super(error);
    }

    static run(error) {
        Modal.onclose = () => {
            User.remove();
            window.location.href = "/";
        };

        Modal.error({
            content: error.name || "Session Timeout",
            subcontent: error.message || "Silahkan Login Kembali",
        });
    }
}
