import { Schema, model } from "mongoose";
import { technicianType } from "../Interfaces";

const technicianSchema = new Schema<technicianType>({
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
      type: Boolean,
      default: true
   },
   rating: {
      type: Number,
      default: 0
   },
   availableSlots: [{
      slotDate: {
         type: String
      },
      slotBooked: {
         type: Boolean,
      },
      _id: false
   }]
}, {
   versionKey: false
});

const technicianModel = model<technicianType>("Technician", technicianSchema);
export { technicianModel, technicianType };