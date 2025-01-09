import AuthMiddleware from "./AuthMiddleware";
import RouteMiddleware from "./RouteMiddleware";

class BeforeEachGuard {
    static guards = [RouteMiddleware, AuthMiddleware];
    static shared = {};

    static build(...toFromNext) {
        BeforeEachGuard.guards.forEach((ClassMiddleware) => {
            new ClassMiddleware([...toFromNext, BeforeEachGuard.shared]);
        });
    }
}

export default BeforeEachGuard;
