import { WalletType } from "../Interfaces";
import { Schema, model } from "mongoose";

const walletSchema = new Schema<WalletType>({
   user_id: {
      type: String,
   },
   balanceAmount: {
      type: Number,
      default: 0,
   },
   transactions: {
      type: [{
         amount: {
            type: Number,
         },
         dateTime: {
            type: String,
         },
         transactionStatus: {
            type: String,
            enum: ["Debit", "Credit"],
            required: true,
         },
         _id: false,
      }],
      default: [],
   },
}, {
   versionKey: false,
});

const Wallet = model<WalletType>("Wallet", walletSchema);
export default Wallet;