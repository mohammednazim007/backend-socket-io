import mongoose from "mongoose";
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
    senderId: new mongoose.Types.ObjectId(senderId),
    receiverId: new mongoose.Types.ObjectId(receiverId),
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

// ** Get accepted friend requests
export const acceptedFriend = async (userId: string) => {
  const userExists = await User.exists({ _id: userId });
  if (!userExists) throw new Error("User not found");

  const populatedUser = await User.findById(userId).populate({
    path: "friends",
    select: "-password",
  });

  return {
    message: "Sent friend requests retrieved successfully",
    users: populatedUser?.friends || [],
  };
};

// ** Get all requested friend
export const getRequestedFriend = async (userId: string) => {
  const userExists = await User.exists({ _id: userId });
  if (!userExists) throw new Error("User not found");

  const populatedUser = await User.findById(userId).populate({
    path: "friendRequests",
    select: "-password",
  });

  return {
    message: "Sent friend requests retrieved successfully",
    users: populatedUser?.friendRequests || [],
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
      { _id: { $nin: user.sentRequests } },
    ],
  }).select("-password");

  return {
    message: "Non-friend users retrieved successfully",
    users: nonFriendUsers,
  };
};

// ** Cancel friend request
// export const cancelRequest = async (senderId: string, receiverId: string) => {
//   const sender = User.findById(senderId);
//   const receiver = User.findById(receiverId);

//   const [senderExists, receiverExists] = await Promise.all([sender, receiver]);
//   if (!senderExists || !receiverExists) throw new Error("User not found");

//   const [updatedSender, updatedReceiver, deleteResult] = await Promise.all([
//     User.findByIdAndUpdate(
//       receiverId,
//       { $pull: { sentRequests: senderId } },
//       { new: true } // Return the updated document
//     ),
//     User.findByIdAndUpdate(
//       senderId,
//       { $pull: { friendRequests: receiverId } },
//       { new: true } // Return the updated document
//     ),
//     Notification.deleteOne({ senderId, receiverId, type: "friend_request" }),
//   ]);

//   return {
//     message: "Friend request cancelled successfully",
//     users: { updatedSender, updatedReceiver },
//   };
// };

export const cancelRequest = async (senderId: string, receiverId: string) => {
  // Ensure both users exist
  const [sender, receiver] = await Promise.all([
    User.findById(senderId),
    User.findById(receiverId),
  ]);

  if (!sender || !receiver) {
    throw new Error("User not found");
  }

  // Update both users
  const [updatedSender, updatedReceiver] = await Promise.all([
    User.findByIdAndUpdate(
      receiverId,
      { $pull: { sentRequests: senderId } },
      { new: true } // Return the updated document
    ),
    User.findByIdAndUpdate(
      senderId,
      { $pull: { friendRequests: receiverId } },
      { new: true } // Return the updated document
    ),
    // Notification.deleteOne({ senderId, receiverId, type: "friend_request" }),
  ]);

  // Delete corresponding notification
  await Notification.deleteMany({
    senderId: new mongoose.Types.ObjectId(receiverId),
    receiverId: new mongoose.Types.ObjectId(senderId),
    type: "friend_request",
  });

  const test = await Notification.find({
    senderId: new mongoose.Types.ObjectId(receiverId),
    receiverId: new mongoose.Types.ObjectId(senderId),
    type: "friend_request",
  });

  console.log("test", test);

  return {
    message: "Friend request cancelled successfully",
    users: { updatedSender, updatedReceiver },
  };
};

//** POST /friends/accept
export const acceptRequest = async (senderId: string, receiverId: string) => {
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!sender || !receiver) throw new Error("User not found");

  // Add each other as friends
  sender.friends.push(receiverId);
  receiver.friends.push(senderId);

  // Remove from pending lists
  sender.sentRequests = sender.sentRequests.filter(
    (id: string) => id.toString() !== receiverId
  );
  receiver.friendRequests = receiver.friendRequests.filter(
    (id: string) => id.toString() !== senderId
  );

  await sender.save();
  await receiver.save();

  return { message: "Friend request accepted", user: { sender, receiver } };
};
