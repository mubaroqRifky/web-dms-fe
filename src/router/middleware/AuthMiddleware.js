import User from "@/controllers/auth/UserController";
import NavigationRoute from "./NavigationRoute";

class AuthMiddleware extends NavigationRoute {
    constructor(toFromNext) {
        super(toFromNext);
        this.run();
    }

    run() {
        const user = User.get();
        if (this.to.meta.needAuth && !user) {
            let redirect;
            if (this.to.name != "dashboard") {
                redirect = encodeURIComponent(this.to.fullPath);
            }
            this.next({
                name: "login",
                query: { redirect },
            });
        } else if (user && this.to.name == "login") {
            this.next({ name: this.from.name });
        }
    }
}

export default AuthMiddleware;
