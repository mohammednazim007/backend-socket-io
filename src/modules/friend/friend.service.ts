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
    sender.sentRequests.includes(receiverId) ||
    receiver.friendRequests.includes(senderId)
  ) {
    throw new Error("Friend request already exists");
  }

  sender.sentRequests.push(receiverId);
  receiver.friendRequests.push(senderId);

  const updatedSender = await sender.save();
  const updatedReceiver = await receiver.save();

  return {
    message: "Friend request sent",
    data: { sender: updatedSender, receiver: updatedReceiver },
  };
};

// ** Accept friend request
// export const acceptRequest = async (
//   userId: string,
//   requesterId: string
// ) => {
//   const user = await User.findById(userId);
//   const requester = await User.findById(requesterId);

//   if (!user || !requester) throw new Error("User not found");

//   user.friendRequests = user.friendRequests.filter(
//     (id) => id.toString() !== requesterId
//   );
//   requester.sentRequests = requester.sentRequests.filter(
//     (id) => id.toString() !== userId
//   );

//   user.friends.push(requesterId);
//   requester.friends.push(userId);

//   await user.save();
//   await requester.save();

//   return { message: "Friend request accepted" };
// };

// // ** Reject friend request
// export const rejectRequest = async (
//   userId: string,
//   requesterId: string
// ) => {
//   const user = await User.findById(userId);
//   const requester = await User.findById(requesterId);

//   if (!user || !requester) throw new Error("User not found");

//   user.friendRequests = user.friendRequests.filter(
//     (id) => id.toString() !== requesterId
//   );
//   requester.sentRequests = requester.sentRequests.filter(
//     (id) => id.toString() !== userId
//   );

//   await user.save();
//   await requester.save();

//   return { message: "Friend request rejected" };
// };
