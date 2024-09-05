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
   findUser(): Promise<IUsers[]>;
   unBlock(user_id: string): Promise<boolean>;
   block(user_id: string): Promise<boolean>;
   findTechnician(): Promise<ITechnicians[]>;
   findBooking(): Promise<IBookings[]>;
};

export interface IAdminServices {
   login(email: string, password: string): Promise<string>;
   findUser(): Promise<IUsers[]>;
   unBlock(user_id: string): Promise<boolean>;
   block(user_id: string): Promise<boolean>;
   findTechnician(): Promise<ITechnicians[]>;
   findBooking(): Promise<IBookings[]>;
};