"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const message = err.message || "Internal Server Error";
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map