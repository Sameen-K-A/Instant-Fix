"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatRepository {
    constructor(chatModel) {
        this.getChat = async (senderID, receiverID) => {
            try {
                const chatResult = await this.chatModel.aggregate([
                    { $match: { chatMembers: { $all: [senderID, receiverID] } } },
                    { $unwind: "$details" },
                    { $project: { _id: 0, details: 1 } },
                ]);
                return chatResult;
            }
            catch (error) {
                throw error;
            }
        };
        this.createChat = async (newChatDocument) => {
            try {
                return await this.chatModel.create(newChatDocument);
            }
            catch (error) {
                throw error;
            }
        };
        this.saveChat = async (newMessageDetails) => {
            try {
                const updateResult = await this.chatModel.updateOne({ chatMembers: { $all: [newMessageDetails.senderID, newMessageDetails.receiverID] } }, { $push: { details: newMessageDetails } });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("Failed to save message");
                }
                ;
            }
            catch (error) {
                throw error;
            }
        };
        this.chatModel = chatModel;
    }
}
exports.default = ChatRepository;
