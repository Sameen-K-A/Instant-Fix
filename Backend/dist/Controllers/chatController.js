"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
class ChatController {
    constructor(chatService) {
        this.getChat = async (req, res) => {
            try {
                const senderID = req.query.senderID;
                const receiverID = req.query.receiverID;
                const chatHistory = await this.chatService.getChat(senderID, receiverID);
                res.status(httpStatusCode_1.default.OK).json(chatHistory);
            }
            catch (error) {
                console.log("chat:= get chat error", error);
                res.status(httpStatusCode_1.default.InternalServerError).json(error);
            }
            ;
        };
        this.chatService = chatService;
    }
    ;
}
;
exports.default = ChatController;
