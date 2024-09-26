"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    chatMembers: [
        {
            type: String,
        }
    ],
    details: [{
            senderID: {
                type: String,
            },
            receiverID: {
                type: String,
            },
            message: {
                type: String,
            },
            time: {
                type: String,
            },
            _id: false
        }],
}, {
    versionKey: false,
    timestamps: true,
});
const Chat = (0, mongoose_1.model)("Chat", chatSchema);
exports.default = Chat;
