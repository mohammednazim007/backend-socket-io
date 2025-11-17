"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (error) => {
    return {
        success: false,
        message: "Validation failed",
        errors: error.issues.map((err) => err.message),
    };
};
exports.handleZodError = handleZodError;
//# sourceMappingURL=handleZodError.js.map