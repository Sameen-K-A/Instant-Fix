import { IBookingHistory, IFilteredBookings, ILocation, ITechnicians, IUser } from "./common.interface";

export interface IAdminServices {
   login(email: string, password: string): { adminAccessToken: string, adminRefreshToken: string };
   findUser(): Promise<IUser[]>;
   unBlock(user_id: string): Promise<boolean>;
   block(user_id: string): Promise<boolean>;
   findTechnician(): Promise<ITechnicians[]>;
   fetchbookingsLocation(): Promise<ILocation[]>;
   getCategories(): Promise<{ categories: { profession: string; count: number }[]; userCount: number; technicianCount: number; bookingCount: number } | null>;
   filteredBooking(selectedDates: string[]): Promise<IFilteredBookings[]>;
   findBooking(): Promise<IBookingHistory[]>;
};