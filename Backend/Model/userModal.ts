import { Schema, model } from "mongoose";

type userType = {
   user_name: string;
   email: string;
   phone: string;
   password: string;
   isBlocked?: boolean
}

const userSchema = new Schema<userType>({
   user_name: {
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
   }
}, {
   versionKey: false
});

const userModel = model<userType>("User", userSchema);
export { userModel, userType };