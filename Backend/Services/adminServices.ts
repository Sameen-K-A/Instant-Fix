import dotenv from "dotenv";
import AdminRepository from "../Repository/adminRepository";
import { createToken } from "../Config/jwt_config";
import { IAdminServices, IUsers, ITechnicians, IBookings } from "../Interfaces/adminInterfaces";
dotenv.config();
const adminRepository = new AdminRepository();
class AdminServices implements IAdminServices {

   async loginService(email: string, password: string): Promise<string> {
      try {
         const orginalEmail = process.env.Admin_email as string;
         const orginalPassword = process.env.Admin_password as string;
         if (orginalEmail === email) {
            if (orginalPassword === password) {
               const adminToken: string = createToken(email);
               return adminToken;
            } else {
               throw new Error("Wrong password");
            };
         } else throw new Error("Wrong email");
      } catch (error) {
         console.log("Login service error : ", error);
         throw error;
      };
   };

   async fetchUserService(): Promise<IUsers[]> {
      try {
         return await adminRepository.fetchUserRepository();
      } catch (error) {
         throw error;
      };
   };

   async unblockUserService(user_id: string): Promise<string> {
      try {
         const response = await adminRepository.unblockUserRepository(user_id);
         if (response.modifiedCount === 1) {
            return "User unblocked successfully";
         } else {
            throw new Error("Can't unblock user");
         };
      } catch (error) {
         throw error;
      };
   };

   async blockUserService(user_id: string): Promise<string> {
      try {
         const response = await adminRepository.blockUserRepository(user_id);
         if (response.modifiedCount === 1) {
            return "User blocked successfully";
         } else {
            throw new Error("Can't block user");
         };
      } catch (error) {
         throw error;
      };
   };

   async fetchTechnicianService(): Promise<ITechnicians[]> {
      try {
         return await adminRepository.fetchTechnicianRepository();
      } catch (error) {
         throw error;
      };
   };

   async fetchBookingsService(): Promise<IBookings[]> {
      try {
         return await adminRepository.fetchBookingsRepository();
      } catch (error) {
         throw error;
      };
   };
   
};

export default AdminServices;