"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse({ body: req.body });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                // errors: error.issues, // ✅ correct property
                fields: error.issues.map((issue) => ({
                    field: issue.path[1],
                    message: issue.message,
                })),
            });
        }
        next(error);
    }
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map