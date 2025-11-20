"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
require("module-alias/register");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = __importDefault(require("./config/db"));
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("./socket/socket-io");
const PORT = process.env.PORT || 5000;
const server = http_1.default.createServer(app_1.default);
(0, socket_io_1.initSocket)(server);
const startServer = async () => {
    try {
        await (0, db_1.default)();
        server.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("Error starting server:", err);
    }
};
startServer();
//# sourceMappingURL=server.js.map