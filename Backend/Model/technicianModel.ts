import mongoose, { Schema } from "mongoose";
import { ITechnicianDetails } from "../Interfaces/techinicianInterfaces";

const TechnicianSchema: Schema = new Schema<ITechnicianDetails>({
   user_id: {
      type: String
   },
   technician_id: {
      type: String
   },
   profession: {
      type: String
   },
   availability: {
      type: Boolean
   },
   rating: {
      type: Number
   },
   notifications: [
      {
         type: String
      }
   ],
   availableSlots: [
      {
         slotDate: {
            type: String
         },
         slotBooked: {
            type: Boolean
         }
      },
   ],
}, {
   versionKey: false,
});

const Technician = mongoose.model<ITechnicianDetails>("Technicians", TechnicianSchema);
export default Technician;