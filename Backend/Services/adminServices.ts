import dotenv from "dotenv";
import AdminRepository from "../Repository/adminRepository";
import { createToken } from "../Config/jwt_config";
import TechnicianRepository from "../Repository/technicianRepository";
dotenv.config();

class AdminServices {

   private adminRepository: AdminRepository;

   constructor() {
      this.adminRepository = new AdminRepository();
   }

   async loginService(email: string, password: string) {
      try {
         const orginalEmail = process.env.Admin_email;
         const orginalPassword = process.env.Admin_password;
         if (orginalEmail === email) {
            if (orginalPassword === password) {
               const adminToken = createToken(email);
               return adminToken;
            }
            else throw new Error("Wrong password");
         }
         else throw new Error("Wrong email");
      } catch (error) {
         console.log("Login service error : ", error);
         throw error;
      }
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

   async fetchTechnicianService() {
      try {
         const repositoryResponse = await this.adminRepository.fetchTechnicianRepository();
         return repositoryResponse;
      } catch (error) {
         throw error;
      }
   }
}

export default AdminServices;