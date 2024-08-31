import { TransactionType, WalletType } from "../Interfaces";
import Wallet from "../Model/WalletModal";

class WalletRepository {

   async addNewWalletForTechnicianRepository(walletData: WalletType) {
      try {
         return await Wallet.create(walletData);
      } catch (error) {
         throw error;
      };
   };

   async fetchWalletDetails(user_id: string) {
      try {
         return await Wallet.findOne({ user_id: user_id }, { _id: 0 });
      } catch (error) {
         throw error;
      };
   };

   async addNewTransactionAndUpdateTotalAmount(technicianUser_id: string, newTransactionDetails: TransactionType, newAmount: number) {
      try {
         return await Wallet.updateOne({ user_id: technicianUser_id }, { $inc: { balanceAmount: newAmount }, $push: { transactions: newTransactionDetails } });
      } catch (error) {
         throw error;
      };
   };

}

export default WalletRepository;