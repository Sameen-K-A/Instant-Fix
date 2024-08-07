import { Router } from "express";
import { verifyToken } from "../Config/jwt_config";
import ChatController from "../Controllers/chatController";

const router = Router();
const chatController = new ChatController();

router.get("/fetchTwoMembersChat", verifyToken, chatController.fetchTwoMembersChatController);
router.post("/sendAndSave_NewMessage", verifyToken, chatController.saveNewMessageController);
router.post("/createConnectionAndSaveMessage", verifyToken, chatController.createConnectionAndSaveMessageController);

export default router;