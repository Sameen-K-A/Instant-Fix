import { Request, Response } from "express";
import ChatServices from "../Services/chatServices";

const chatService = new ChatServices();

class ChatController {

  async fetchTwoMembersChatController(req: Request, res: Response) {
    try {
      const senderID = req.query.senderID as string;
      const receiverID = req.query.receiverID as string;
      const chatHistory = await chatService.fetchTwoMembersChatService(senderID, receiverID);
      res.status(200).json(chatHistory);
    } catch (error) {
      res.status(500).json(error);
    };
  };

  async saveNewMessageController(req: Request, res: Response) {
    try {
      const { messageDetails } = req.body;
      await chatService.saveNewChatService(messageDetails.senderID, messageDetails.receiverID, messageDetails.message);
      res.status(200).json({ message: "Message sent successfully!" });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async createConnectionAndSaveMessageController(req: Request, res: Response) {
    try {
      const { messageDetails } = req.body;
      await chatService.createConnectionAndSaveMessageService(messageDetails);
      res.status(200).json({ message: "Connection build and save message" });
    } catch (error) {
      res.status(500).json(error);
    }
  }

}

export default ChatController;