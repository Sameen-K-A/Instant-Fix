"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WalletRepository {
    constructor(walletModel) {
        this.createWallet = async (walletData) => {
            try {
                return await this.walletModel.create(walletData);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.getWallet = async (user_id) => {
            try {
                return await this.walletModel.findOne({ user_id: user_id }, { _id: 0 });
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.updateWallet = async (technicianUser_id, newTransactionDetails, newAmount) => {
            try {
                const updateResult = await this.walletModel.updateOne({ user_id: technicianUser_id }, { $inc: { balanceAmount: newAmount }, $push: { transactions: newTransactionDetails } });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("Failed to update wallet");
                }
                ;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.walletModel = walletModel;
    }
}
;
exports.default = WalletRepository;
