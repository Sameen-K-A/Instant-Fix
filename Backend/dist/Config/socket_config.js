"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.configSocketIO = void 0;
const socket_io_1 = require("socket.io");
const userModal_1 = __importDefault(require("../Model/userModal"));
const bookingModel_1 = __importDefault(require("../Model/bookingModel"));
const reviewModal_1 = __importDefault(require("../Model/reviewModal"));
const chatModel_1 = __importDefault(require("../Model/chatModel"));
const chatServices_1 = __importDefault(require("../Services/chatServices"));
const userRepository_1 = __importDefault(require("../Repository/userRepository"));
const chatRepository_1 = __importDefault(require("../Repository/chatRepository"));
const userRepository = new userRepository_1.default(userModal_1.default, bookingModel_1.default, reviewModal_1.default);
const chatRepository = new chatRepository_1.default(chatModel_1.default);
const chatService = new chatServices_1.default(chatRepository, userRepository);
let io;
let onlineUser = {};
const configSocketIO = (server) => {
    exports.io = io = new socket_io_1.Server(server, {
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
            }
            else {
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
                let savedMessage = null;
                if (firstTimeChat === true) {
                    const connectionDetails = await chatService.createChat(messageDetails);
                    savedMessage = connectionDetails?.details[0];
                }
                else {
                    savedMessage = await chatService.saveChat(messageDetails);
                }
                ;
                const chatRoom = [messageDetails.senderID, messageDetails.receiverID].sort().join("-");
                io.to(chatRoom).emit("receiveMessage", savedMessage);
                io.to(`chatNotificationRoom${savedMessage?.receiverID}`).emit("newChatNotification", savedMessage?.message);
            }
            catch (error) {
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
exports.configSocketIO = configSocketIO;
