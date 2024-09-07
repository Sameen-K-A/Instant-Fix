import { ITransaction, IWallet } from "./common.interface"

export interface IWalletRepository {
   createWallet(walletData: IWallet): Promise<IWallet>
   getWallet(user_id: string): Promise<IWallet | null>
   updateWallet(technicianUser_id: string, newTransactionDetails: ITransaction, newAmount: number): Promise<boolean>
};