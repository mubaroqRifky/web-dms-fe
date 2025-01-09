import AuthException from "./AuthException";
import DefaultException from "./DefaultException";
import InputException from "./InputException";
import UnauthorizedException from "./UnauthorizedException";

const EXCEPTION = {
    ValidationException: "ValidationException",
    AuthenticationException: "AuthenticationException",
    AccessDeniedHttpException: "AccessDeniedHttpException",
    TokenExpiredException: "TokenExpiredException",
};

export default class ResponseException extends Error {
    constructor(error) {
        super(error);
    }

    static run(error) {
        try {
            let { response, name, message } = error;

            if (response && typeof response?.data == "object") {
                const { data, exception, message: msg } = response.data;
                message = msg || message;
                const exceptionName = data?.exception || exception || name;

                switch (exceptionName) {
                    case EXCEPTION.ValidationException:
                        InputException.run(response.data);
                        break;
                    case EXCEPTION.AuthenticationException:
                    case EXCEPTION.TokenExpiredException:
                        AuthException.run({ name: exceptionName, message });
                        break;
                    case EXCEPTION.AccessDeniedHttpException:
                        UnauthorizedException.run({
                            name: exceptionName,
                            message,
                        });
                        break;
                    default:
                        DefaultException.run({ name: exceptionName, message });
                        break;
                }
            } else {
                DefaultException.run({
                    name: response?.data || error?.name,
                    message: response?.message || error?.message,
                });
            }
        } catch (error) {
            DefaultException.run(error);
        }
    }
}
