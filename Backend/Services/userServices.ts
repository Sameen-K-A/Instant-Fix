import UserRepository from "../Repository/userRepository";
import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";
import { userType } from "../Model/userModal";
import sendOTPmail from "../Config/Email_config";
import { createToken } from "../Config/jwt_config";
import { userAddressType } from "../Model/userAddressModal";
class UserServices {
   private userRepository: UserRepository;

   constructor(userRepository: UserRepository) {
      this.userRepository = userRepository;
   }

   async loginUserService(email: string, password: string) {
      try {
         const userData = await this.userRepository.findUser(email);
         if (!userData) {
            throw new Error("email not found");
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

   async registerUserService(userData: userType): Promise<{ OTP: string; expiryOTP_time: Date }> {
      try {
         const alreadyExists = await this.userRepository.findUser(userData.email);
         if (alreadyExists) {
            throw new Error("Email already exists");
         }
         const OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
         console.log(`Generated OTP is : ${OTP}`);
         const isMailSended = await sendOTPmail(userData.email, OTP);
         if (!isMailSended) {
            throw new Error("Email not send");
         }
         const OTP_createdTime = new Date();
         const expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000);
         return { OTP, expiryOTP_time };
      } catch (error) {
         throw error;
      }
   }

   async otpVerifiedService(userData: userType) {
      try {
         const hashedPassword = await bcrypt.hash(userData.password, 10);
         userData.password = hashedPassword;
         userData.user_id = uuid();
         return await this.userRepository.registerUserRepository(userData);
      } catch (error) {
         throw error;
      }
   }

   async resendOTPService(email: string): Promise<{ OTP: string; expiryOTP_time: Date }> {
      try {
         const OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
         console.log(`Re-generated OTP is : ${OTP}`);
         const isMailSended = await sendOTPmail(email, OTP);
         if (!isMailSended) {
            throw new Error("Email not send");
         }
         const OTP_createdTime = new Date();
         const expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000);
         return { OTP, expiryOTP_time };
      } catch (error) {
         throw error;
      }
   }

   async fetchAddressService(user_id: string) {
      const userAddressDetails = await this.userRepository.fetchAddressRepository(user_id);
      return userAddressDetails;
   }

   async addAddressService(addressData: userAddressType) {
      addressData.address_id = uuid();
      return await this.userRepository.addAddressRepository(addressData);
   }

   async deleteAddressService(address_id: string) {
      const repositoryResponse = await this.userRepository.deleteAddressRepository(address_id);
      if (repositoryResponse.deletedCount == 1) return "Deleted successfully"
      else return "Not deleted";
   }
}

export default UserServices;