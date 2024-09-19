import { Router } from "express";
import { verifyToken } from "../Config/jwt_config";
import ChatController from "../Controllers/chatController";
import ChatServices from "../Services/chatServices";
import ChatRepository from "../Repository/chatRepository";
import Chat from "../Model/chatModel";
import UserRepository from "../Repository/userRepository";
import User from "../Model/userModal";
import Booking from "../Model/bookingModel";
import Rating from "../Model/reviewModal";
import isBloked from "../Middleware/userAuth";

const chatRepository = new ChatRepository(Chat);
const userRepository = new UserRepository(User, Booking, Rating);
const chatService = new ChatServices(chatRepository, userRepository)
const chatController = new ChatController(chatService);

const router = Router();

router.get("/fetchTwoMembersChat", verifyToken, isBloked, chatController.getChat);

export default router;