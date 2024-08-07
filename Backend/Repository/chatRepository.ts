import { Chat, ChatType } from "../Model/chatModel";
import { newMesssageType } from "../Services/chatServices";

class ChatRepository {

  async fetchTwoMembersChatRepository(senderID: string, receiverID: string) {
    try {
      const chatResult = await Chat.aggregate([
        { $match: { chatMembers: { $all: [senderID, receiverID] } } },
        { $unwind: "$details" },
        { $project: { _id: 0, details: 1 } }
      ]);
      return chatResult;
    } catch (error) {
      throw error;
    }
  };

  async createConnectionAndSaveMessageRepository(newChatDocument: ChatType) {
    try {
      return await Chat.create(newChatDocument);
    } catch (error) {
      throw error;
    }
  };

  async saveNewChatRepository(newMessageDetails: newMesssageType) {
    try {
      return Chat.updateOne(
        { chatMembers: { $all: [newMessageDetails.senderID, newMessageDetails.receiverID] } },
        { $push: { details: newMessageDetails } }
      );
    } catch (error) {
      console.error("Error during save new chat operation:", error);
      throw error;
    }
  };

};

export default ChatRepository;