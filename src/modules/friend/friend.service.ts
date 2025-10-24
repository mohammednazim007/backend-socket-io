import { getReceiverSocketId, io } from "../../socket/socket-io";
import Notification from "../notification/notification.model";
import User from "../user/user.model";

// ** Send friend request
export const sendRequest = async (senderId: string, receiverId: string) => {
  if (senderId === receiverId)
    throw new Error("Cannot send request to yourself");

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!sender || !receiver) throw new Error("User not found");

  if (
    sender.friends.includes(receiverId) ||
    sender.friendRequests.includes(receiverId) ||
    sender.sentRequests.includes(receiverId) ||
    receiver.sentRequests.includes(senderId) ||
    receiver.friendRequests.includes(senderId)
  ) {
    throw new Error("Friend request already exists");
  }

  sender.sentRequests.push(receiverId);
  receiver.friendRequests.push(senderId);

  const updatedSender = await sender.save();
  const updatedReceiver = await receiver.save();

  // ✅ 1. Create a persistent notification
  const notification = await Notification.create({
    senderId,
    receiverId,
    type: "friend_request",
    name: sender.name,
    message: `${sender.name} sent you a friend request.`,
    avatar: sender.avatar,
  });

  // ✅ 2. If receiver online, send real-time notification
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("friend_request_received", {
      senderId,
      senderName: sender.name,
      message: notification.message,
      notificationId: notification._id,
      createdAt: notification.createdAt,
    });
  }

  return {
    message: "Friend request sent",
    data: { sender: updatedSender, receiver: updatedReceiver },
  };
};

// ** Get sent friend requests
export const getSentRequests = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Populate the sent requests with user details
  const populatedUser = await User.findById(userId).populate(
    "sentRequests",
    "name email avatar"
  );

  return {
    message: "Sent friend requests retrieved successfully",
    sentRequests: populatedUser?.sentRequests || [],
  };
};

// ** Get all non-friend users
// 1. The current user
// 2. Users who are already friends
// 3. Users who have sent friend requests to this user
// 4. Users to whom this user has sent friend requests
export const getNonFriendUsers = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const nonFriendUsers = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: user.friends } },
      // { _id: { $nin: user.friendRequests } },
      // { _id: { $nin: user.sentRequests } },
    ],
  }).select("-password");

  return {
    message: "Non-friend users retrieved successfully",
    users: nonFriendUsers,
  };
};

// ** Cancel friend request
export const cancelRequest = async (senderId: string, receiverId: string) => {
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!sender || !receiver) throw new Error("User not found");

  // Remove the receiverId from sender's sentRequests
  sender.sentRequests = sender.sentRequests.filter(
    (id: string) => id.toString() !== receiverId
  );

  // Remove the senderId from receiver's friendRequests
  receiver.friendRequests = receiver.friendRequests.filter(
    (id: string) => id.toString() !== senderId
  );

  await sender.save();
  await receiver.save();

  // Delete any related notification
  await Notification.deleteOne({
    senderId,
    receiverId,
    type: "friend_request",
  });

  return { message: "Friend request cancelled successfully" };
};

// POST /friends/accept
// export const acceptFriendRequest = async (req, res) => {
//   const { senderId, receiverId } = req.body;
//   const sender = await User.findById(senderId);
//   const receiver = await User.findById(receiverId);

//   if (!sender || !receiver) return res.status(404).json({ message: "User not found" });

//   // Add each other as friends
//   sender.friends.push(receiverId);
//   receiver.friends.push(senderId);

//   // Remove from pending lists
//   receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);
//   sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiverId);

//   await sender.save();
//   await receiver.save();

//   res.json({ message: "Friend request accepted" });
// };

// // POST /friends/reject
// export const rejectFriendRequest = async (req, res) => {
//   const { senderId, receiverId } = req.body;
//   const receiver = await User.findById(receiverId);

//   receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);
//   await receiver.save();

//   res.json({ message: "Friend request rejected" });
// };
