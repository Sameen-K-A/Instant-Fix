import { UpdateWriteOpResult } from "mongoose";

export interface IUsers {
   user_id: string;
   name: string;
   email: string;
   phone: string;
   isBlocked: boolean;
};

export interface ITechnicians extends IUsers {
   technicianDetails: {
      profession: string;
   };
};

export interface IBookings {
   booking_id: string;
   client_id: string;
   technicianUser_id: string;
   booking_status: "Requested" | "Rejected" | "Pending" | "Completed" | "Cancelled";
   booking_profession: string;
   bookingTime: string;
   bookingDate: string;
   serviceDate: string;
   serviceCompletedDate: "Pending" | string;
   serviceCost: string;
   payment_status: "Pending" | "Completed" | "Requested";
   serviceLocation: IServiceLocation;
   technicianDetails: Omit<IUsers, "user_id" | "isBlocked">;
   userDetails: Omit<IUsers, "user_id" | "isBlocked">;
};

export interface IServiceLocation {
   address: string;
   district: string;
   state: string;
   phone: string;
   alternatePhone: string;
   pincode: string;
   location: {
      type: "Point";
      coordinates: [number, number];
   };
};

export interface IAdminRepository {
   fetchUserRepository(): Promise<IUsers[]>;
   unblockUserRepository(user_id: string): Promise<UpdateWriteOpResult>;
   blockUserRepository(user_id: string): Promise<UpdateWriteOpResult>;
   fetchTechnicianRepository(): Promise<ITechnicians[]>;
   fetchBookingsRepository(): Promise<IBookings[]>;
};

export interface IAdminServices {
   loginService(email: string, password: string): Promise<string>;
   fetchUserService(): Promise<IUsers[]>;
   unblockUserService(user_id: string): Promise<string>;
   blockUserService(user_id: string): Promise<string>;
   fetchTechnicianService(): Promise<ITechnicians[]>;
   fetchBookingsService(): Promise<IBookings[]>;
};