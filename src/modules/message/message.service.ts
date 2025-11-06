import { IMessage } from "@/modules/message/message.interface";
import Message from "@/modules/message/message.model";

// ** Create the message
export const createMessage = async (
  data: Partial<IMessage>
): Promise<IMessage> => {
  const message = await Message.create(data);

  // return message.populate(["sender_id", "receiver_id"]);
  return message;
};

// ** GET the message
export const getMessages = async (
  sender_id: string,
  receiver_id: string
): Promise<IMessage[]> => {
  return await Message.find({
    $or: [
      { sender_id, receiver_id },
      { sender_id: receiver_id, receiver_id: sender_id },
    ],
  }).sort({ createdAt: 1 });
};
