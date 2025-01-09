import InputValidation from "@/controllers/state/InputValidationController";
import Modal from "@/controllers/state/ModalController";

export default class InputException extends Error {
    constructor(error) {
        super(error);
    }

    static run(response) {
        const result = InputException.mappingError(response.data.errors);
        InputValidation.set(result);
        InputException.scrollFirstElementError();
        Modal.error({
            content: response.data.exception,
            subcontent: response.message,
        });
    }

    static mappingError(errResponse) {
        let errors = {};

        for (const key in errResponse) {
            errors[key] = {
                value: false,
                message: errResponse[key].join(", "),
            };
        }

        return errors;
    }

    static scrollFirstElementError() {
        setTimeout(() => {
            const elErrors = document.querySelectorAll(".danger");
            if (elErrors.length) {
                elErrors[0].parentElement.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        }, 0);
    }
}
