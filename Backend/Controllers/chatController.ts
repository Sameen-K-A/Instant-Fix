import { Request, Response } from "express";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { IChatService } from "../Interfaces/chat.service.interface";

class ChatController {

  private chatService: IChatService;

  constructor(chatService: IChatService) {
    this.chatService = chatService;
  };

  getChat = async (req: Request, res: Response) => {
    try {
      const senderID = req.query.senderID as string;
      const receiverID = req.query.receiverID as string;
      const chatHistory = await this.chatService.getChat(senderID, receiverID);
      res.status(HTTP_statusCode.OK).json(chatHistory);
    } catch (error) {
      res.status(HTTP_statusCode.InternalServerError).json(error);
    };
  };

};

export default ChatController;