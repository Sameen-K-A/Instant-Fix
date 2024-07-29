import { Schema, model } from "mongoose";

type technicianType = {
   user_id: string;
   technician_id: string;
   profession: string;
   availability?: boolean;
   rating?: Number;
}

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
   }
}, {
   versionKey: false
});

const technicianModel = model<technicianType>("Technician", technicianSchema);
export { technicianModel, technicianType };