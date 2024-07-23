import UserRepository from "../Repository/userRepository";
import bcrypt from 'bcrypt';
import { userType } from "../Model/userModal";
import sendOTPmail from "../Config/Email_config";

class UserServices {
   private userRepository: UserRepository;

   constructor(userRepository: UserRepository) {
      this.userRepository = userRepository;
   }

   async registerUserService(userData: userType) {
      const alreadyExists = await this.userRepository.userAlreadyExists(userData.email);
      if (!alreadyExists) {
         const OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
         console.log(OTP);
         const isMailSended = await sendOTPmail(userData.email, OTP);
         if (isMailSended) return OTP;
         else return "OTP not sended";
      } else {
         return "Email already exists";
      }
   }

   async otpVerifiedService(userData: userType) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
      return await this.userRepository.registerUserRepository(userData);
   }
}

export default UserServices;