import { Model } from "mongoose";
import { IWalletRepository } from "../Interfaces/wallet.repository.interface";
import { ITransaction, IWallet } from "../Interfaces/common.interface";

class WalletRepository implements IWalletRepository {
   private walletModel: Model<IWallet>;

   constructor(walletModel: Model<IWallet>) {
      this.walletModel = walletModel
   }

   createWallet = async (walletData: IWallet): Promise<IWallet> => {
      try {
         return await this.walletModel.create(walletData);
      } catch (error) {
         throw error;
      };
   };

   getWallet = async (user_id: string): Promise<IWallet | null> => {
      try {
         return await this.walletModel.findOne({ user_id: user_id }, { _id: 0 });
      } catch (error) {
         throw error;
      };
   };

   updateWallet = async (technicianUser_id: string, newTransactionDetails: ITransaction, newAmount: number): Promise<boolean> => {
      try {
         const updateResult = await this.walletModel.updateOne({ user_id: technicianUser_id }, { $inc: { balanceAmount: newAmount }, $push: { transactions: newTransactionDetails } });
         if (updateResult.modifiedCount === 1) {
            return true;
         } else {
            throw new Error("Failed to update wallet");
         };
      } catch (error) {
         throw error;
      };
   };

};

export default WalletRepository;