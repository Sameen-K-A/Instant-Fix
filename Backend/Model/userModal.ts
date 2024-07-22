import { Schema, model } from "mongoose";

type userType = {
   user_name: string;
   email: string;
   phone: string;
   password: string;
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
   }
}, {
   versionKey: false
});

const userModel = model<userType>("User", userSchema);
export { userModel, userType };