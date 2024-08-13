export type userType = {
   user_id?: string;
   name: string;
   email: string;
   phone: string;
   password: string;
   isBlocked?: boolean;
   profileIMG: string;
   isTechnician?: boolean;
   addressDetails?: null | userAddressType;
   alreadychattedtechnician?: string[];
};

export type userAddressType = {
   name: string;
   address: string;
   district: string;
   state: string;
   pincode: string;
   phone: string;
   alternatePhone: string;
   location?: {
      type: "Point";
      coordinates: [number, number];
   };
};

export type editAddressType = {
   name: string;
   address: string;
   pincode: string;
   phone: string;
   alternatePhone: string;
};

export type newBookingType = {
   booking_id: string;
   client_id: string;
   technicianUser_id: string;
   bookingTime: string;
   bookingDate: string;
   Booking_profession: string;
   booking_status: "Requested" | "Rejected" | "Pending" | "Completed" | "Cancelled";
}