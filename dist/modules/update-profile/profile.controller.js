"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSecurityController = void 0;
const profile_validation_1 = require("./profile.validation");
const profile_service_1 = require("./profile.service");
const zod_1 = require("zod");
const handleZodError_1 = require("../../utils/handleZodError");
const updateSecurityController = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        const parsedData = profile_validation_1.securityValidation.parse(req.body);
        const updatedUser = await (0, profile_service_1.updateProfileSecurity)(userId, parsedData);
        return res.status(200).json({
            success: true,
            message: "Security settings updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json((0, handleZodError_1.handleZodError)(error));
        }
        next(error);
    }
};
exports.updateSecurityController = updateSecurityController;
//# sourceMappingURL=profile.controller.js.map