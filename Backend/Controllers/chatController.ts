import { Request, Response } from "express";
import ChatServices from "../Services/chatServices";
import HTTP_statusCode from "../Enums/httpStatusCode";

const chatService = new ChatServices();

class ChatController {

  async fetchTwoMembersChatController(req: Request, res: Response) {
    try {
      const senderID = req.query.senderID as string;
      const receiverID = req.query.receiverID as string;
      const chatHistory = await chatService.fetchTwoMembersChatService(senderID, receiverID);
      res.status(HTTP_statusCode.OK).json(chatHistory);
    } catch (error) {
      res.status(HTTP_statusCode.InternalServerError).json(error);
    };
  };

}

export default ChatController;