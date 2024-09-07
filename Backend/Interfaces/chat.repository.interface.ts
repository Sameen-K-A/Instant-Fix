import { IChat, IChatMessage } from "./common.interface";

export interface IChatRepository {
   createChat(newChatDocument: IChat): Promise<IChat>;
   getChat(senderID: string, receiverID: string): Promise<IChat[]>;
   saveChat(newMessageDetails: IChatMessage): Promise<boolean>;
};