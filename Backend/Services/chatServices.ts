import ChatRepository from "../Repository/chatRepository";
import { ChatType } from "../Model/chatModel";
import UserRepository from "../Repository/userRepository";

export type newMesssageType = {
  senderID: string,
  receiverID: string,
  message: string
};

class ChatServices {

  private chatRepository: ChatRepository;
  private userRepository: UserRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
    this.userRepository = new UserRepository();
  };

  async fetchTwoMembersChatService(senderID: string, receiverID: string) {
    try {
      return await this.chatRepository.fetchTwoMembersChatRepository(senderID, receiverID);
    } catch (error) {
      throw error;
    };
  };

  async saveNewChatService(senderID: string, receiverID: string, message: string) {
    try {
      const newMessageDetails: newMesssageType = {
        senderID: senderID,
        receiverID: receiverID,
        message: message
      }
      await this.chatRepository.saveNewChatRepository(newMessageDetails);
      return newMessageDetails;
    } catch (error) {
      throw error;
    }
  };

  async createConnectionAndSaveMessageService(messageDetails: newMesssageType) {
    try {
      const newChatDocument: ChatType = {
        chatMembers: [messageDetails.senderID, messageDetails.receiverID],
        details: [{
          senderID: messageDetails.senderID,
          receiverID: messageDetails.receiverID,
          message: messageDetails.message
        }]
      };
      const connectionDetails = this.chatRepository.createConnectionAndSaveMessageRepository(newChatDocument);
      await Promise.all([
        this.userRepository.addNewConnectionToAlreadyChattedTechnicianListRepository(messageDetails.receiverID, messageDetails.senderID),
        connectionDetails
      ])
      return connectionDetails;
    } catch (error) {
      return error;
    }
  }
}

export default ChatServices;