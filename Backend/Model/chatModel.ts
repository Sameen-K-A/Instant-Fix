import { Schema, model } from "mongoose";

type ChatType = {
  chatMembers?: string[];
  details: {
    senderID: string;
    receiverID: string;
    message: string;
    time?: Date;
  }[];
};

const chatSchema = new Schema<ChatType>({
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
    }
  }]
}, {
  versionKey: false,
});

const Chat = model<ChatType>("Chat", chatSchema);
export { Chat, ChatType };