import { Schema, model } from "mongoose";

type userType = {
   user_id?: string,
   name: string;
   email: string;
   phone: string;
   password: string;
   isBlocked?: boolean;
   profileIMG: string;
   isTechnician?: boolean;
}

const userSchema = new Schema<userType>({
   user_id: {
      type: String
   },
   name: {
      type: String
   },
   email: {
      type: String
   },
   phone: {
      type: String
   },
   password: {
      type: String
   },
   isBlocked: {
      type: Boolean,
      default: false
   },
   profileIMG: {
      type: String,
      default: "userDefaultProfile.png"
   },
   isTechnician: {
      type: Boolean,
      default: false
   }
}, {
   versionKey: false
});

const userModel = model<userType>("User", userSchema);
export { userModel, userType };