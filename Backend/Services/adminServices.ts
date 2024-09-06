import dotenv from "dotenv";
import { IAdminServices, IUsers, ITechnicians, IBookings, IAdminRepository } from "../Interfaces/adminInterfaces";
import { createToken } from "../Config/jwt_config";
dotenv.config();

class AdminServices implements IAdminServices {
   private adminRepository: IAdminRepository;

   constructor(adminRepository: IAdminRepository) {
      this.adminRepository = adminRepository;
   };

   login = (email: string, password: string): string => {
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
         throw error;
      };
   };

   findUser = async (): Promise<IUsers[]> => {
      try {
         return await this.adminRepository.findUser();
      } catch (error) {
         throw error;
      };
   };

   unBlock = async (user_id: string): Promise<boolean> => {
      try {
         return await this.adminRepository.unBlock(user_id);
      } catch (error) {
         throw error;
      };
   };

   block = async (user_id: string): Promise<boolean> => {
      try {
         return await this.adminRepository.block(user_id);
      } catch (error) {
         throw error;
      };
   };

   findTechnician = async (): Promise<ITechnicians[]> => {
      try {
         return await this.adminRepository.findTechnician();
      } catch (error) {
         throw error;
      };
   };

   findBooking = async (): Promise<IBookings[]> => {
      try {
         return await this.adminRepository.findBooking();
      } catch (error) {
         throw error;
      };
   };

};

export default AdminServices;