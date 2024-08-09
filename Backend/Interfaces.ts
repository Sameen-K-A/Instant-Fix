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