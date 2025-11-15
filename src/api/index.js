"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("tsconfig-paths/register");
const app_1 = __importDefault(require("@/app"));
const db_1 = __importDefault(require("@/config/db"));
let dbConnected = false;
async function handler(req, res) {
    if (!dbConnected) {
        await (0, db_1.default)();
        dbConnected = true;
    }
    (0, app_1.default)(req, res);
}
//# sourceMappingURL=index.js.map