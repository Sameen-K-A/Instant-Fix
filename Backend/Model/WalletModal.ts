import { Schema, model } from "mongoose";
import { IWallet } from "../Interfaces/common.interface";

const walletSchema: Schema = new Schema<IWallet>({
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

const Wallet = model<IWallet>("Wallet", walletSchema);
export default Wallet;