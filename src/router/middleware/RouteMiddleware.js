import User from "@/controllers/auth/UserController";
import NavigationRoute from "./NavigationRoute";

class RouteMiddleware extends NavigationRoute {
    constructor(toFromNext) {
        super(toFromNext);
        this.run();
    }

    run() {
        window.router = null;
        const canAccess = User.canAccessRoute(this.to);
        if (!canAccess) window.router = this.router;
        this.shared = { unauthorized: !canAccess };
    }
}

export default RouteMiddleware;
