// technicianModel.ts

import mongoose, { Schema, Document } from "mongoose";
import { ITechnicianDetails } from "../Interfaces/techinicianInterfaces";

const TechnicianSchema: Schema = new Schema({
  user_id: { type: String, required: true },
  technician_id: { type: String, required: true },
  profession: { type: String, required: true },
  availability: { type: Boolean, required: true },
  rating: { type: Number, required: true },
  notifications: [{ type: String }],
  availableSlots: [{
    slotDate: { type: String, required: true },
    slotBooked: { type: Boolean, required: true }
  }]
});

const technicianModel = mongoose.model<ITechnicianDetails & Document>("Technician", TechnicianSchema);

export default technicianModel;