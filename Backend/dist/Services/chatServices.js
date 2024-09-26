"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatServices {
    constructor(chatRepository, userRepository) {
        this.getChat = async (senderID, receiverID) => {
            try {
                return await this.chatRepository.getChat(senderID, receiverID);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.saveChat = async (newMessageDetails) => {
            try {
                await this.chatRepository.saveChat(newMessageDetails);
                return newMessageDetails;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.createChat = async (messageDetails) => {
            try {
                const current = new Date();
                const newChatDocument = {
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
                await this.userRepository.createConnectionToChatFriends(messageDetails.receiverID, messageDetails.senderID);
                return connectionDetails;
            }
            catch (error) {
                throw error;
            }
        };
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }
}
;
exports.default = ChatServices;
