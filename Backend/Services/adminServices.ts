import { createToken, createRefreshToken } from "../Config/jwt_config";
import { IAdminServices } from "../Interfaces/admin.service.interface";
import { IAdminRepository } from "../Interfaces/admin.repository.interface";
import { IBookingHistory, IFilteredBookings, ILocation, ITechnicians, IUser } from "../Interfaces/common.interface";
import { generateGetPreSignedURL } from "../Config/s3_config";
import dotenv from "dotenv";
dotenv.config();

class AdminServices implements IAdminServices {
   private adminRepository: IAdminRepository;

   constructor(adminRepository: IAdminRepository) {
      this.adminRepository = adminRepository;
   };

   login = (email: string, password: string): { adminAccessToken: string, adminRefreshToken: string } => {
      try {
         const orginalEmail = process.env.Admin_email as string;
         const orginalPassword = process.env.Admin_password as string;
         if (orginalEmail === email) {
            if (orginalPassword === password) {
               const adminAccessToken: string = createToken(email);
               const adminRefreshToken: string = createRefreshToken(email);
               return { adminAccessToken, adminRefreshToken };
            } else {
               throw new Error("Wrong password");
            };
         } else throw new Error("Wrong email");
      } catch (error) {
         throw error;
      };
   };

   findUser = async (): Promise<IUser[]> => {
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

   getCategories = async (): Promise<{ categories: { profession: string; count: number }[]; userCount: number; technicianCount: number; bookingCount: number } | null> => {
      try {
         const [categories, users, bookings] = await Promise.all([
            this.adminRepository.getCategories(),
            this.adminRepository.findUser(),
            this.adminRepository.findBooking(),
         ]);
         const technicians = users.filter((user: IUser) => (user.isTechnician === true));
         return {
            categories: categories || [],
            userCount: users.length,
            technicianCount: technicians.length,
            bookingCount: bookings.length,
         };
      } catch (error) {
         throw error;
      }
   };

   fetchbookingsLocation = async (): Promise<ILocation[]> => {
      try {
         return await this.adminRepository.fetchbookingsLocation();
      } catch (error) {
         throw error;
      };
   };

   filteredBooking = async (selectedDates: string[]): Promise<IFilteredBookings[]> => {
      try {
         return this.adminRepository.filteredBooking(selectedDates);
      } catch (error) {
         throw error;
      };
   };

   findBooking = async (): Promise<any[]> => {
      try {
         let response = await this.adminRepository.findBooking();
         response = response.map((booking: any) => ({
            ...booking,
            technicianDetails: { ...booking.technicianDetails, profileIMG: booking.technicianDetails?.profileIMG && generateGetPreSignedURL(booking.technicianDetails?.profileIMG) },
            userDetails: { ...booking.userDetails, profileIMG: booking.userDetails?.profileIMG && generateGetPreSignedURL(booking.userDetails?.profileIMG) }
         }));
         return response;
      } catch (error) {
         throw error;
      }
   };


};

export default AdminServices;