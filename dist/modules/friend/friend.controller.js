"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptFriendRequest = exports.cancelFriendRequestByMe = exports.cancelFriendRequest = exports.getAcceptedFriend = exports.sendFriendRequest = exports.getAllRequestedFriend = exports.getAllNonFriendUsers = void 0;
const friend_service_1 = require("../../modules/friend/friend.service");
// ============================================================
// ✅ CONTROLLER: getAllNonFriendUsers
// METHOD: GET
// ROUTE: /friends/non-friends
// PURPOSE:
//    - Retrieve all users who are NOT friends, NOT requested, and NOT the current user.
// LOGIC:
//    - Extracts logged-in user's ID from request.
//    - Calls `getNonFriendUsers` service to fetch eligible users.
//    - Responds with the list or error if something goes wrong.
// ============================================================
const getAllNonFriendUsers = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await (0, friend_service_1.getNonFriendUsers)(userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getAllNonFriendUsers = getAllNonFriendUsers;
// ============================================================
// ✅ CONTROLLER: getAllRequestedFriend
// METHOD: GET
// ROUTE: /friends/requests
// PURPOSE:
//    - Retrieve all incoming friend requests for the logged-in user.
// LOGIC:
//    - Gets user ID from request.
//    - Calls `getRequestedFriend` service to fetch pending requests.
//    - Returns pending friend requests or an error message.
// ============================================================
const getAllRequestedFriend = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await (0, friend_service_1.getRequestedFriend)(userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getAllRequestedFriend = getAllRequestedFriend;
// ============================================================
// ✅ CONTROLLER: sendFriendRequest
// METHOD: PUT
// ROUTE: /friends/send
// PURPOSE:
//    - Handles sending a new friend request from one user to another.
// LOGIC:
//    - Reads `senderId` and `receiverId` from request body.
//    - Calls `sendRequest` service to process and notify the receiver.
//    - Returns success message or error details.
// ============================================================
const sendFriendRequest = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const result = await (0, friend_service_1.sendRequest)(senderId, receiverId);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.sendFriendRequest = sendFriendRequest;
// ============================================================
// ✅ CONTROLLER: getAcceptedFriend
// METHOD: GET
// ROUTE: /friends/accepted
// PURPOSE:
//    - Retrieves all friends (accepted connections) of the logged-in user.
// LOGIC:
//    - Extracts user ID from request.
//    - Calls `acceptedFriend` service to get confirmed friends list.
//    - Returns user data or error.
// ============================================================
const getAcceptedFriend = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await (0, friend_service_1.acceptedFriend)(userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getAcceptedFriend = getAcceptedFriend;
// ============================================================
// ✅ CONTROLLER: cancelFriendRequest
// METHOD: DELETE
// ROUTE: /friends/cancel/:receiverId
// PURPOSE:
//    - Allows the sender to cancel a pending friend request.
// LOGIC:
//    - Extracts `senderId` from authenticated user and `receiverId` from route params.
//    - Calls `cancelRequest` service to remove pending requests and delete notifications.
//    - Logs and returns appropriate success or error message.
// ============================================================
const cancelFriendRequest = async (req, res) => {
    try {
        const senderId = req.user?.id;
        const { receiverId } = req.params;
        const result = await (0, friend_service_1.cancelRequest)(senderId, receiverId);
        return res.status(200).json(result);
    }
    catch (error) {
        // Log error for debugging, then send generic 400 response
        console.error("Cancel Request Error:", error.message);
        res.status(400).json({ message: error.message });
    }
};
exports.cancelFriendRequest = cancelFriendRequest;
// cancel friend request by me
const cancelFriendRequestByMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { friendId } = req.params;
        const result = await (0, friend_service_1.cancelRequestByMe)(userId, friendId);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Cancel Request Error:", error.message);
        res.status(400).json({ message: error.message });
    }
};
exports.cancelFriendRequestByMe = cancelFriendRequestByMe;
// ============================================================
// ✅ CONTROLLER: acceptFriendRequest
// METHOD: PUT
// ROUTE: /friends/accept
// PURPOSE:
//    - Handles accepting an incoming friend request.
// LOGIC:
//    - Reads `senderId` and `receiverId` from request body.
//    - Calls `acceptRequest` service to add both users to each other’s friends list.
//    - Responds with updated user data or an error message.
// ============================================================
const acceptFriendRequest = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const result = await (0, friend_service_1.acceptRequest)(senderId, receiverId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.acceptFriendRequest = acceptFriendRequest;
//# sourceMappingURL=friend.controller.js.map