import UserRepository from "../Repository/userRepository";
import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";
import { userType } from "../Model/userModal";
import sendOTPmail from "../Config/Email_config";
import { createToken } from "../Config/jwt_config";
import { userAddressType } from "../Model/userAddressModal";
import { editAddressType, newBookingType } from "../Interfaces";
import { io } from "../Config/Socket_config";

class UserServices {
   private userRepository: UserRepository;
   private OTP: string | null = null;
   private expiryOTP_time: Date | null = null;
   private userData: userType | null = null;

   constructor(userRepository: UserRepository) {
      this.userRepository = userRepository;
   };

   async loginUserService(email: string, password: string) {
      try {
         const userData = await this.userRepository.loginUserRepository(email);
         if (!userData) {
            throw new Error("email not found");
         }
         if (userData.isBlocked) {
            throw new Error("User is blocked");
         }
         const comparePassword = await bcrypt.compare(password, userData.password);
         if (!comparePassword) {
            throw new Error("Wrong password");
         }
         const userToken = createToken(userData.user_id as string);
         return { userToken, userData };
      } catch (error) {
         throw error;
      }
   };

   async registerUserService(userData: userType): Promise<void> {
      try {
         const alreadyExists = await this.userRepository.findUserByEmail(userData.email);
         if (alreadyExists) {
            throw new Error("Email already exists");
         }
         this.userData = userData;
         const Generated_OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
         this.OTP = Generated_OTP;
         console.log(`Generated OTP is : ${Generated_OTP}`);
         const isMailSended = await sendOTPmail(userData.email, Generated_OTP);
         if (!isMailSended) {
            throw new Error("Email not send");
         }
         const OTP_createdTime = new Date();
         this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000);
         return;
      } catch (error) {
         throw error;
      }
   };

   async otpVerifiedService(enteredOTP: string) {
      try {
         if (enteredOTP !== this.OTP) {
            throw new Error("Incorrect OTP");
         }
         const currentTime = new Date();
         if (currentTime > this.expiryOTP_time!) {
            throw new Error("OTP is expired");
         }
         const hashedPassword = await bcrypt.hash(this.userData!.password, 10);
         this.userData!.password = hashedPassword;
         this.userData!.user_id = uuid();
         const response = await this.userRepository.registerUserRepository(this.userData!);
         this.OTP = null;
         this.expiryOTP_time = null;
         this.userData = null;
         return response;
      } catch (error) {
         throw error;
      }
   };

   async resendOTPService(): Promise<void> {
      try {
         const Generated_OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
         this.OTP = Generated_OTP;
         console.log(`Re-generated OTP is : ${Generated_OTP}`);
         const isMailSended = await sendOTPmail(this.userData!.email, Generated_OTP);
         if (!isMailSended) {
            throw new Error("Email not send");
         }
         const OTP_createdTime = new Date();
         this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000);
      } catch (error) {
         throw error;
      }
   };

   async fetchAddressService(user_id: string) {
      try {
         const userAddressDetails = await this.userRepository.fetchAddressRepository(user_id);
         return userAddressDetails;
      } catch (error) {
         console.log("fetch address service error : ", error);
         throw error;
      }
   };

   async addAddressService(addressData: userAddressType) {
      try {
         addressData.address_id = uuid();
         return await this.userRepository.addAddressRepository(addressData);
      } catch (error) {
         throw error
      }
   };

   async editAddressService(address_id: string, name: string, address: string, pincode: string, phone: string, alternatePhone: string): Promise<string> {
      try {
         const editedAddressData: editAddressType = {
            name,
            address,
            pincode,
            phone,
            alternatePhone
         };
         const repositoryResponse = await this.userRepository.editAddressRepository(address_id, editedAddressData);
         if (repositoryResponse.modifiedCount === 0) {
            throw new Error("No changes founded");
         }
         return "okay";
      } catch (error) {
         throw error;
      }
   }

   async deleteAddressService(address_id: string) {
      try {
         const repositoryResponse = await this.userRepository.deleteAddressRepository(address_id);
         if (repositoryResponse.deletedCount == 1) {
            return "Deleted successfully"
         }
         else throw new Error("Not deleted");
      } catch (error) {
         throw error;
      }
   };

   async changePasswordService(user_id: string, currentPass: string, newPass: string) {
      try {
         const userDetails = await this.userRepository.findUserByUser_id(user_id);
         if (!userDetails) {
            throw new Error("User not found");
         }
         const validCurrentPass = await bcrypt.compare(currentPass, userDetails.password);
         if (!validCurrentPass) {
            throw new Error("Current password is wrong");
         }
         const hashedNewPassword = await bcrypt.hash(newPass, 10);
         await this.userRepository.changepasswordRepository(user_id, hashedNewPassword);
      } catch (error) {
         throw error;
      }
   }

   async editProfileService(user_id: string, name: string, phone: string, profileIMG: string | null): Promise<string> {
      try {
         const updatedInformation: { name: string; phone: string; profileIMG?: string } = {
            name: name,
            phone: phone,
         };
         if (profileIMG) {
            updatedInformation.profileIMG = profileIMG;
         }
         const repositoryResponse = await this.userRepository.editProfileRepository(user_id, updatedInformation);
         if (repositoryResponse.modifiedCount === 0) {
            throw new Error("No changes founded");
         }
         return "okay";
      } catch (error) {
         throw error;
      }
   }

   async fetchTechnicianService(user_id: string) {
      try {
         return await this.userRepository.fetchTechnicianRepository(user_id);
      } catch (error) {
         console.log("Fetch technician service error : ", error);
         throw error;
      }
   };

   async fetchAlreadyChattedTechniciansService(user_id: string) {
      try {
         return await this.userRepository.fetchAlreadyChattedTechniciansRepository(user_id);
      } catch (error) {
         throw error;
      }
   };

   async bookTechnicianService(clientID: string, technicianUserID: string) {
      try {
         const technicianInformation: any = await this.userRepository.fetchSingleTechnicianDetailsRepository(technicianUserID);
         if (technicianInformation[0].isBlocked === true || technicianInformation[0].technicianDetails.availability === false) {
            throw new Error("Technician not available now");
         };
         const date: Date = new Date();
         const newBookingDetails: newBookingType = {
            booking_id: uuid() as string,
            client_id: clientID,
            technicianUser_id: technicianUserID,
            bookingTime: date.toLocaleTimeString(),
            bookingDate: date.toLocaleDateString(),
            Booking_profession: technicianInformation?.technicianDetails?.profession,
            booking_status: "Requested",
         };
         const repositoryResponse = await this.userRepository.bookTechnicianRepository(newBookingDetails);
         if (!repositoryResponse) {
            throw new Error("Booking failed");
         };
         io.to(`technicianNotificaionRoom${technicianUserID}`).emit("newJobRequest", { message: "You have a new booking request" });
         return repositoryResponse;
      } catch (error) {
         throw error
      };
   };

   async fetchAnyPendingRequestAvailableService(clientID: string, technicianUserID: string) {
      try {
         return this.userRepository.fetchAnyPendingRequestAvailableRepository(clientID, technicianUserID);
      } catch (error) {
         throw error;
      }
   }
};

export default UserServices;