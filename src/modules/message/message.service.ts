import { IMessage } from "@/modules/message/message.interface";
import Message from "@/modules/message/message.model";

// ============================================================
// ✅ Create a new message
//    - Saves a message (text/media) to MongoDB.
// ============================================================
export const createMessage = async (
  data: Partial<IMessage>
): Promise<IMessage> => {
  const message = await Message.create(data);
  return message;
};

// ============================================================
// ✅ Get chat messages
//    - Fetches all messages between two users (sender & receiver).
// ============================================================
export const getMessages = async (
  userId: string,
  friend_id: string
): Promise<IMessage[]> => {
  if (!userId || !friend_id)
    throw new Error("userId and friend_id are required");

  return await Message.find({
    $or: [
      { user_id: userId, friend_id: friend_id },
      { user_id: friend_id, friend_id: userId },
    ],
  }).sort({ createdAt: 1 });
};
