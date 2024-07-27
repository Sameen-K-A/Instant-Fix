import dotenv from "dotenv";
import AdminRepository from "../Repository/adminRepository";
import { createToken } from "../Config/jwt_config";
dotenv.config();

class AdminServices {

   private adminRepository: AdminRepository;

   constructor() {
      this.adminRepository = new AdminRepository();
   }

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

   async fetchUserService() {
      try {
         return this.adminRepository.fetchUserRepository();
      } catch (error) {
         throw error;
      }
   }

   async unblockUserService(user_id: string) {
      try {
         const response = await this.adminRepository.unblockUserRepository(user_id);
         if (response.modifiedCount === 1) {
            return "User unblocked successfully";
         } else {
            throw new Error("Can't unblock user");
         }
      } catch (error) {
         throw error;
      }
   }

   async blockUserService(user_id: string) {
      try {
         const response = await this.adminRepository.blockUserRepository(user_id);
         if (response.modifiedCount === 1) {
            return "User blocked successfully";
         } else {
            throw new Error("Can't block user");
         }
      } catch (error) {
         throw error;
      }
   }


}

export default AdminServices;