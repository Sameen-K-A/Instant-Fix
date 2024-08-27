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
   },
   serviceDate: {
      type: String
   },
   serviceCompletedDate: {
      type: String,
   },
   serviceCost: {
      type: String
   },
   Payment_Status: {
      type: String
   },
   serviceLocation: {
      address: { type: String },
      district: { type: String },
      state: { type: String },
      phone: { type: String },
      alternatePhone: { type: String },
      pincode: { type: String },
      location: {
         type: { type: String, enum: ["Point"], default: "Point" },
         coordinates: { type: [Number], default: [0, 0] },
      },
   },
}, {
   versionKey: false
});

const BookingModel = model<newBookingType>("Bookings", bookingSchema);
export default BookingModel;