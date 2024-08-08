import { Router } from "express";
import { verifyToken } from "../Config/jwt_config";
import ChatController from "../Controllers/chatController";

const router = Router();
const chatController = new ChatController();

router.get("/fetchTwoMembersChat", verifyToken, chatController.fetchTwoMembersChatController);

export default router;