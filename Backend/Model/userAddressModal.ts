import { Schema, model } from "mongoose";

type userAddressType = {
   user_id: string;
   address_id?: string;
   name: string;
   address: string;
   pincode: string;
   phone: string;
   alternatePhone: string;
}

const userAddressSchema = new Schema<userAddressType>({
   user_id: {
      type: String,
   },
   address_id: {
      type: String
   },
   name: {
      type: String
   },
   address: {
      type: String
   },
   pincode: {
      type: String
   },
   phone: {
      type: String
   },
   alternatePhone: {
      type: String
   }
}, {
   versionKey: false
});

const userAddressModal = model<userAddressType>("Address", userAddressSchema);
export { userAddressModal, userAddressType };