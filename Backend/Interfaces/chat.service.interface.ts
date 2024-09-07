import { IChat, IChatMessage } from "./common.interface";

export interface IChatService {
   createChat(newChatDocument: IChatMessage): Promise<IChat>;
   getChat(senderID: string, receiverID: string): Promise<IChat[]>;
   saveChat(newMessageDetails: IChatMessage): Promise<IChatMessage>;
}