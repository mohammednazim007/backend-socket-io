"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("tsconfig-paths/register"); // resolve @/ aliases
const app_1 = __importDefault(require("@/app"));
const db_1 = __importDefault(require("@/config/db"));
let dbConnected = false;
// Express adapter for Vercel serverless
const expressHandler = (req, res) => new Promise((resolve, reject) => {
    (0, app_1.default)(req, res, (err) => {
        if (err)
            reject(err);
        else
            resolve();
    });
});
async function handler(req, res) {
    if (!dbConnected) {
        await (0, db_1.default)();
        dbConnected = true;
    }
    try {
        await expressHandler(req, res);
    }
    catch (err) {
        console.error("Serverless handler error:", err);
        res.status(500).send("Internal Server Error");
    }
}
//# sourceMappingURL=index.js.map