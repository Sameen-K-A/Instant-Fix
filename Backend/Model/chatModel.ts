import { Schema, model } from "mongoose";
import { IChat } from "../Interfaces/common.interface";

const chatSchema: Schema = new Schema<IChat>({
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
      type: Date,
      default: Date.now,
    },
    _id: false
  }],
}, {
  versionKey: false,
});

const Chat = model<IChat>("Chat", chatSchema);
export default Chat;