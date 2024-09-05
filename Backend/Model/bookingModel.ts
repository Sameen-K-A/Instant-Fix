import { Schema, model } from "mongoose";
import { IBookingDetails } from "../Interfaces/techinicianInterfaces";

const bookingSchema: Schema = new Schema<IBookingDetails>({
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
   booking_profession: {
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
   payment_status: {
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
   reviewAdded: {
      type: Boolean,
      default: false
   },
}, {
   versionKey: false
});

const Booking = model<IBookingDetails>("Bookings", bookingSchema);
export default Booking;