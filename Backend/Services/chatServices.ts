import { IChat, IChatMessage } from "../Interfaces/common.interface";
import { IUserRepository } from "../Interfaces/user.repository.interface";
import { IChatRepository } from "../Interfaces/chat.repository.interface";
import { IChatService } from "../Interfaces/chat.service.interface";

class ChatServices implements IChatService {
  private chatRepository: IChatRepository;
  private userRepository: IUserRepository;

  constructor(chatRepository: IChatRepository, userRepository: IUserRepository) {
    this.chatRepository = chatRepository;
    this.userRepository = userRepository;
  }

  getChat = async (senderID: string, receiverID: string): Promise<IChat[]> => {
    try {
      return await this.chatRepository.getChat(senderID, receiverID);
    } catch (error) {
      throw error;
    };
  };

  saveChat = async (newMessageDetails: IChatMessage): Promise<IChatMessage> => {
    try {
      await this.chatRepository.saveChat(newMessageDetails);
      return newMessageDetails;
    } catch (error) {
      throw error;
    };
  };

  createChat = async (messageDetails: IChatMessage): Promise<IChat> => {
    try {
      const current: Date = new Date();
      const newChatDocument: IChat = {
        chatMembers: [messageDetails.senderID, messageDetails.receiverID],
        details: [
          {
            senderID: messageDetails.senderID,
            receiverID: messageDetails.receiverID,
            message: messageDetails.message,
            time: current.toISOString().slice(0, 16).replace('T', ', ')
          },
        ],
      };

      const connectionDetails = await this.chatRepository.createChat(newChatDocument);
      await this.userRepository.createConnectionToChatFriends(
        messageDetails.receiverID,
        messageDetails.senderID
      );

      return connectionDetails;
    } catch (error) {
      throw error;
    }
  };

};

export default ChatServices;