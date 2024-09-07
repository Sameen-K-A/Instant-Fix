import { IBookingHistory, ITechnicians, IUser } from "./common.interface";

export interface IAdminServices {
   login(email: string, password: string): string;
   findUser(): Promise<IUser[]>;
   unBlock(user_id: string): Promise<boolean>;
   block(user_id: string): Promise<boolean>;
   findTechnician(): Promise<ITechnicians[]>;
   findBooking(): Promise<IBookingHistory[]>;
};