import dotenv from "dotenv";
import { createToken } from "../Config/jwt_config";
dotenv.config();

class AdminServices {

   async loginService(email: string, password: string) {
      const orginalEmail = process.env.Admin_email;
      const orginalPassword = process.env.Admin_password;
      if (orginalEmail === email) {
         if (orginalPassword === password) {
            const adminToken = createToken(email);
            return adminToken;
         }
         else return "Wrong password";
      }
      else return "Wrong email";
   }

}

export default AdminServices;