import { IBookingHistory, ILocation, ITechnicians, IUser } from "./common.interface";

export interface IAdminRepository {
   findUser(): Promise<IUser[]>;
   unBlock(user_id: string): Promise<boolean>;
   block(user_id: string): Promise<boolean>;
   findTechnician(): Promise<ITechnicians[]>;
   fetchbookingsLocation(): Promise<ILocation[]>;
   getCategories(): Promise<{ profession: string; count: number }[] | null>;
   findBooking(): Promise<IBookingHistory[]>;
};