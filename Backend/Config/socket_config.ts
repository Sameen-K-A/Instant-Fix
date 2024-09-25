import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";

import User from "../Model/userModal";
import Booking from "../Model/bookingModel";
import Rating from "../Model/reviewModal";
import Chat from "../Model/chatModel";

import ChatServices from "../Services/chatServices";
import UserRepository from "../Repository/userRepository";
import ChatRepository from "../Repository/chatRepository";
import { IChatMessage } from "../Interfaces/common.interface";

const userRepository = new UserRepository(User, Booking, Rating);
const chatRepository = new ChatRepository(Chat);
const chatService = new ChatServices(chatRepository, userRepository);

let io: SocketServer;
let onlineUser: { [key: string]: string } = {};

const configSocketIO = (server: HttpServer) => {
   io = new SocketServer(server, {
      cors: {
         origin: ["http://localhost:5173", 'https://instant-fix.vercel.app'],
         methods: ["GET", "POST"],
      },
   });

   io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("joinChatRoom", ({ senderID, receiverID }) => {
         const roomName = [senderID, receiverID].sort().join("-");
         onlineUser[senderID] = socket.id;
         socket.join(roomName);
         if (onlineUser[receiverID]) {
            io.emit("receiverIsOnline", { user_id: receiverID });
         } else {
            io.emit("receiverIsOffline", { user_id: receiverID });
         }
         console.log(`User ${senderID} joined room: ${roomName}`);
      });

      socket.on("enterToChatScreen", ({ user_id }) => {
         onlineUser[user_id] = socket.id;
         io.emit("receiverIsOnline", { user_id });
      });

      socket.on("leaveFromChatScreen", ({ user_id }) => {
         if (onlineUser[user_id]) {
            delete onlineUser[user_id];
            io.emit("receiverIsOffline", { user_id });
         }
      });

      socket.on("sendMessage", async ({ messageDetails, firstTimeChat }) => {
         try {
            let savedMessage: null | IChatMessage = null;
            if (firstTimeChat === true) {
               const connectionDetails: any = await chatService.createChat(messageDetails);
               savedMessage = connectionDetails?.details[0];
            } else {
               savedMessage = await chatService.saveChat(messageDetails);
            };
            const chatRoom = [messageDetails.senderID, messageDetails.receiverID].sort().join("-");
            io.to(chatRoom).emit("receiveMessage", savedMessage);
            io.to(`chatNotificationRoom${savedMessage?.receiverID}`).emit("newChatNotification", savedMessage?.message);
         } catch (error) {
            console.log(error);
         }
      });

      socket.on("joinTechnicianNoficationRoom", (technicianUserID) => {
         socket.join(`technicianNotificaionRoom${technicianUserID}`);
         console.log(`Technician ${technicianUserID} joined his notification room`);
      });

      socket.on("chatNotificationRoom", (user_id) => {
         socket.join(`chatNotificationRoom${user_id}`);
      });

      socket.on("disconnect", () => {
         const disconnectUser = Object.keys(onlineUser).find((user_id) => onlineUser[user_id] === socket.id);
         if (disconnectUser) {
            delete onlineUser[disconnectUser];
            io.emit("receiverIsOffline", { user_id: disconnectUser });
         }
         console.log(`User disconnected: ${socket.id}`);
      });
   });
};

export { configSocketIO, io };