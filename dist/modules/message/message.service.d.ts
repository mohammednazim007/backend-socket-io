import { IMessage } from "../../modules/message/message.interface";
export declare const createMessage: (data: Partial<IMessage>) => Promise<IMessage>;
export declare const getMessages: (userId: string, friend_id: string) => Promise<IMessage[]>;
