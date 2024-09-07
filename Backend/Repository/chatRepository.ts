import { Model } from "mongoose";
import { IChatRepository } from "../Interfaces/chat.repository.interface";
import { IChat, IChatMessage } from "../Interfaces/common.interface";

class ChatRepository implements IChatRepository {
  private chatModel: Model<IChat>;

  constructor(chatModel: Model<IChat>) {
    this.chatModel = chatModel;
  }

  getChat = async (senderID: string, receiverID: string): Promise<IChat[]> => {
    try {
      const chatResult = await this.chatModel.aggregate([
        { $match: { chatMembers: { $all: [senderID, receiverID] } } },
        { $unwind: "$details" },
        { $project: { _id: 0, details: 1 } },
      ]);
      return chatResult;
    } catch (error) {
      throw error;
    }
  };

  createChat = async (newChatDocument: IChat): Promise<IChat> => {
    try {
      return await this.chatModel.create(newChatDocument);
    } catch (error) {
      throw error;
    }
  };

  saveChat = async (newMessageDetails: IChatMessage): Promise<boolean> => {
    try {
      const updateResult = await this.chatModel.updateOne(
        { chatMembers: { $all: [newMessageDetails.senderID, newMessageDetails.receiverID] } },
        { $push: { details: newMessageDetails } }
      );

      if (updateResult.modifiedCount === 1) {
        return true;
      } else {
        throw new Error("Failed to save message");
      };
    } catch (error) {
      throw error;
    }
  };
}

export default ChatRepository;