"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoute = void 0;
const healthRoute = (req, res, next) => {
    try {
        return res.status(200).json({
            status: "UP",
            message: "Service is healthy",
        });
    }
    catch (err) {
        console.error("Health check failed:", err);
        return res.status(503).json({
            status: "DOWN",
            message: "Service is unavailable",
        });
    }
};
exports.healthRoute = healthRoute;
//# sourceMappingURL=healthMiddleware.js.map