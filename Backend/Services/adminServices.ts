import { createToken, createRefreshToken } from "../Config/jwt_config";
import { IAdminServices } from "../Interfaces/admin.service.interface";
import { IAdminRepository } from "../Interfaces/admin.repository.interface";
import { IFilteredBookings, ILocation, ITechnicians, IUser } from "../Interfaces/common.interface";
import { generateGetPreSignedURL } from "../Config/s3_config";
import dotenv from "dotenv";
import { io } from "../Config/socket_config";
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
               const adminAccessToken: string = createToken(email, process.env.adminRole as string);
               const adminRefreshToken: string = createRefreshToken(email, process.env.adminRole as string);
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
         const result = await this.adminRepository.block(user_id);
         io.emit(`AdminBlockMessage${user_id}`, { message: "Your account has been temporarily blocked. Please contact our team for assistance." });
         return result;
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
         response = await Promise.all(response.map(async (booking: any) => {
            const technicianProfileIMG = booking.technicianDetails?.profileIMG ? await generateGetPreSignedURL(booking.technicianDetails.profileIMG) : "";
            const userProfileIMG = booking.userDetails?.profileIMG ? await generateGetPreSignedURL(booking.userDetails.profileIMG) : "";
            return {
               ...booking,
               technicianDetails: { ...booking.technicianDetails, profileIMG: technicianProfileIMG },
               userDetails: { ...booking.userDetails, profileIMG: userProfileIMG }
            };
         }));
         return response;
      } catch (error) {
         throw error;
      }
   };

};

export default AdminServices;