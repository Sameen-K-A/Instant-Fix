import { Schema, model } from "mongoose";
import { newBookingType } from "../Interfaces";

const bookingSchema = new Schema<newBookingType>({
   booking_id: {
      type: String
   },
   client_id: {
      type: String
   },
   technicianUser_id: {
      type: String
   },
   booking_status: {
      type: String
   },
   Booking_profession: {
      type: String
   },
   bookingTime: {
      type: String
   },
   bookingDate: {
      type: String
   }
}, {
   versionKey: false
});

const BookingModel = model<newBookingType>("Bookings", bookingSchema);
export default BookingModel;