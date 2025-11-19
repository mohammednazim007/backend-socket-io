"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptRequest = exports.cancelRequestByMe = exports.cancelRequest = exports.getNonFriendUsers = exports.getRequestedFriend = exports.acceptedFriend = exports.sendRequest = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("../../socket/socket-io");
const notification_model_1 = __importDefault(require("../../modules/notification/notification.model"));
const user_model_1 = __importDefault(require("../../modules/user/user.model"));
// ============================================================
// ✅ Method: POST- sendRequest
// PURPOSE: Handles sending a friend request between two users.
// LOGIC:
// - Prevents sending a request to yourself.
// - Ensures both users exist.
// - Checks for duplicate or invalid requests.
// - Updates both users atomically using `$push`.
// - Creates a persistent notification for the receiver.
// - Emits a real-time event if the receiver is online.
// ============================================================
const sendRequest = async (senderId, receiverId) => {
    if (senderId === receiverId) {
        throw new Error("Cannot send a friend request to yourself");
    }
    // Fetch both users in parallel
    const [sender, receiver] = await Promise.all([
        user_model_1.default.findById(senderId),
        user_model_1.default.findById(receiverId),
    ]);
    if (!sender || !receiver) {
        throw new Error("User not found");
    }
    // Prevent duplicate or invalid requests
    if (sender.friends.includes(receiverId) ||
        sender.sentRequests.includes(receiverId) ||
        sender.friendRequests.includes(receiverId) ||
        receiver.friends.includes(senderId) ||
        receiver.friendRequests.includes(senderId)) {
        throw new Error("Friend request already exists");
    }
    // ✅ Update both users atomically using $push (faster than .save())
    const [updatedSender, updatedReceiver] = await Promise.all([
        user_model_1.default.findByIdAndUpdate(senderId, { $push: { sentRequests: receiverId } }, { new: true }),
        user_model_1.default.findByIdAndUpdate(receiverId, { $push: { friendRequests: senderId } }, { new: true }),
    ]);
    // ✅ Create persistent notification
    const notification = await notification_model_1.default.create({
        senderId: new mongoose_1.default.Types.ObjectId(senderId),
        receiverId: new mongoose_1.default.Types.ObjectId(receiverId),
        type: "friend_request",
        name: sender.name,
        message: `${sender.name} sent you a friend request.`,
        avatar: sender.avatar,
    });
    // ✅ Emit real-time event if receiver is online
    const receiverSocketId = (0, socket_io_1.getReceiverSocketId)(receiverId);
    if (receiverSocketId) {
        socket_io_1.io.to(receiverSocketId).emit("friend_request_received", {
            senderId,
            senderName: sender.name,
            message: notification.message,
            notificationId: notification._id,
            createdAt: notification.createdAt,
        });
    }
    return {
        message: "Friend request sent successfully",
        data: { sender: updatedSender, receiver: updatedReceiver },
    };
};
exports.sendRequest = sendRequest;
// ============================================================
// ✅ Method: GET- acceptedFriend
// PURPOSE: Fetch all accepted (confirmed) friends of a user.
// LOGIC:
// - Checks if the user exists.
// - Populates the "friends" field from the User model.
// - Returns the list of accepted friends.
// ============================================================
const acceptedFriend = async (userId) => {
    const userExists = await user_model_1.default.exists({ _id: userId });
    if (!userExists)
        throw new Error("User not found");
    const populatedUser = await user_model_1.default.findById(userId).populate({
        path: "friends",
        select: "-password",
    });
    return {
        message: "Sent friend requests retrieved successfully",
        users: populatedUser?.friends || [],
    };
};
exports.acceptedFriend = acceptedFriend;
// ============================================================
// ✅ Method: GET- getRequestedFriend
// PURPOSE: Retrieve all pending friend requests for a user.
// LOGIC:
// - Verifies user existence.
// - Populates the "friendRequests" field.
// - Returns all users who have sent friend requests to this user.
// ============================================================
const getRequestedFriend = async (userId) => {
    const userExists = await user_model_1.default.exists({ _id: userId });
    if (!userExists)
        throw new Error("User not found");
    const populatedUser = await user_model_1.default.findById(userId).populate({
        path: "friendRequests",
        select: "-password",
    });
    return {
        message: "Sent friend requests retrieved successfully",
        users: populatedUser?.friendRequests || [],
    };
};
exports.getRequestedFriend = getRequestedFriend;
// ============================================================
// ✅ Method: GET- getNonFriendUsers
// PURPOSE: Get all users who are not friends, not requested, and not self.
// LOGIC:
// - Finds users who are not in the current user's friends or sentRequests list.
// - Excludes the logged-in user.
// - Returns all such non-friend users.
// ============================================================
const getNonFriendUsers = async (userId) => {
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new Error("User not found");
    const nonFriendUsers = await user_model_1.default.find({
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: user.friends } },
            // { _id: { $nin: user.friendRequests } },
            // { _id: { $nin: user.sentRequests } },
        ],
    }).select("-password");
    return {
        message: "Friend retrieved successfully",
        users: nonFriendUsers,
    };
};
exports.getNonFriendUsers = getNonFriendUsers;
// ============================================================
// ✅ Method: DELETE- cancelRequest
// PURPOSE: Cancel a sent friend request.
// LOGIC:
// - Prevents canceling request to yourself.
// - Fetches both users.
// - Removes the pending request from both sender and receiver.
// - Deletes corresponding notifications from the database.
// ============================================================
const cancelRequest = async (senderId, receiverId) => {
    if (senderId === receiverId)
        throw new Error("Cannot cancel a request to yourself");
    // Fetch both users in parallel
    const [sender, receiver] = await Promise.all([
        user_model_1.default.findById(senderId),
        user_model_1.default.findById(receiverId),
    ]);
    if (!sender || !receiver)
        throw new Error("User not found in database");
    // ✅ Remove pending request
    const [updatedSender, updatedReceiver] = await Promise.all([
        user_model_1.default.findByIdAndUpdate(senderId, { $pull: { friendRequests: receiverId } }, { new: true }),
        user_model_1.default.findByIdAndUpdate(receiverId, { $pull: { sentRequests: senderId } }, { new: true }),
    ]);
    // ✅ Delete any corresponding notification
    await notification_model_1.default.deleteOne({
        senderId: new mongoose_1.default.Types.ObjectId(receiverId),
        receiverId: new mongoose_1.default.Types.ObjectId(senderId),
        type: "friend_request",
    });
    return {
        message: "Friend request cancelled successfully",
        data: { sender: updatedSender, receiver: updatedReceiver },
    };
};
exports.cancelRequest = cancelRequest;
// ============================================================
// ✅ Method: DELETE- cancelRequestByMe
// PURPOSE: Cancel a friend request sent by the user.
// LOGIC:
// - Prevents canceling request to yourself.
// - Fetches both users.
// - Removes the pending request from both sender and receiver.
// - Deletes corresponding notifications from the database.
// ============================================================
const cancelRequestByMe = async (userId, friendId) => {
    if (userId === friendId)
        throw new Error("Cannot cancel a request to yourself");
    // Fetch both users in parallel
    const [currentUser, friend] = await Promise.all([
        user_model_1.default.findById(userId),
        user_model_1.default.findById(friendId),
    ]);
    if (!currentUser || !friend)
        throw new Error("User not found in database");
    // ✅ Remove pending request
    const [updatedSender, updatedReceiver] = await Promise.all([
        user_model_1.default.findByIdAndUpdate(userId, { $pull: { sentRequests: friendId } }, { new: true }),
        user_model_1.default.findByIdAndUpdate(friendId, { $pull: { friendRequests: userId } }, { new: true }),
    ]);
    // ✅ Delete any corresponding notification
    await notification_model_1.default.deleteOne({
        senderId: new mongoose_1.default.Types.ObjectId(userId),
        receiverId: new mongoose_1.default.Types.ObjectId(friendId),
        type: "friend_request",
    });
    return {
        message: "Friend request cancelled successfully",
        data: { sender: updatedSender, receiver: updatedReceiver },
    };
};
exports.cancelRequestByMe = cancelRequestByMe;
// ============================================================
// ✅ Method: PUT- acceptRequest
// PURPOSE: Accept a received friend request.
// LOGIC:
// - Fetches both users (sender and receiver).
// - Adds each other to their friends list.
// - Removes the pending request from both users.
// - Saves the updated user documents.
// ============================================================
const acceptRequest = async (senderId, receiverId) => {
    const sender = await user_model_1.default.findById(senderId);
    const receiver = await user_model_1.default.findById(receiverId);
    if (!sender || !receiver)
        throw new Error("User not found");
    // Add each other as friends
    sender.friends.push(receiverId);
    receiver.friends.push(senderId);
    // Remove from pending lists
    sender.sentRequests = sender.sentRequests.filter((id) => id.toString() !== receiverId);
    receiver.friendRequests = receiver.friendRequests.filter((id) => id.toString() !== senderId);
    await sender.save();
    await receiver.save();
    return { message: "Friend request accepted", user: { sender, receiver } };
};
exports.acceptRequest = acceptRequest;
//# sourceMappingURL=friend.service.js.map