"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//** export default router;
const express_1 = __importDefault(require("express"));
const friend_controller_1 = require("@/modules/friend/friend.controller");
const auth_middleware_1 = require("@/middlewares/auth.middleware");
const router = express_1.default.Router();
//** Get all users who are not friends or requested
router.get("/non-friends", auth_middleware_1.authMiddleware, friend_controller_1.getAllNonFriendUsers);
//** Get all incoming friend requests
router.get("/get-requested-friends", auth_middleware_1.authMiddleware, friend_controller_1.getAllRequestedFriend);
//** Send a friend request to another user
router.put("/send-request", auth_middleware_1.authMiddleware, friend_controller_1.sendFriendRequest);
//** Get all accepted friends of logged-in user
router.get("/accepted-friends", auth_middleware_1.authMiddleware, friend_controller_1.getAcceptedFriend);
//** Accept a friend request
router.put("/accept-request", auth_middleware_1.authMiddleware, friend_controller_1.acceptFriendRequest);
//** Cancel a sent friend request
router.delete("/cancel-request/:receiverId", auth_middleware_1.authMiddleware, friend_controller_1.cancelFriendRequest);
router.delete("/cancel-request-by-me/:friendId", auth_middleware_1.authMiddleware, friend_controller_1.cancelFriendRequestByMe);
exports.default = router;
//# sourceMappingURL=friend.routes.js.map