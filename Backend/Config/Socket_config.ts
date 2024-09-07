import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";

import User from "../../Backend/Model/userModal";
import Booking from "../../Backend/Model/bookingModel";
import Rating from "../../Backend/Model/reviewModal";
import Chat from "../../Backend/Model/chatModel";

import ChatServices from "../../Backend/Services/chatServices";
import UserRepository from "../../Backend/Repository/userRepository";
import ChatRepository from "../../Backend/Repository/chatRepository"; 

const userRepository = new UserRepository(User, Booking, Rating);
const chatRepository = new ChatRepository(Chat);
const chatService = new ChatServices(chatRepository, userRepository);

let io: SocketServer;

const configSocketIO = (server: HttpServer) => {
   io = new SocketServer(server, {
      cors: {
         origin: "http://localhost:5173",
         methods: ["GET", "POST"],
      },
   });

   io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("joinChatRoom", ({ senderID, receiverID }) => {
         const roomName = [senderID, receiverID].sort().join("-");
         socket.join(roomName);
         console.log(`User ${senderID} joined room: ${roomName}`);
      });

      socket.on("sendMessage", async ({ messageDetails, firstTimeChat }) => {
         try {
            let savedMessage: null | any = null
            if (firstTimeChat === true) {
               const connectionDetails: any = await chatService.createChat(messageDetails);
               savedMessage = connectionDetails?.details[0];
            } else {
               savedMessage = await chatService.saveChat(messageDetails);
            };
            const chatRoom = [messageDetails.senderID, messageDetails.receiverID].sort().join("-");
            io.to(chatRoom).emit("receiveMessage", savedMessage);
         } catch (error) {
            console.log(error)
         }
      })

      socket.on("joinTechnicianNoficationRoom", (technicianUserID) => {
         socket.join(`technicianNotificaionRoom${technicianUserID}`);
         console.log(`Technician ${technicianUserID} joined his notification room`);
      });

      socket.on("disconnect", () => {
         console.log(`User disconnected: ${socket.id}`);
      });
   });
}

export { configSocketIO, io };