import UserRepository from "../Repository/userRepository";
import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";
import { userType } from "../Model/userModal";
import sendOTPmail from "../Config/Email_config";
import { createToken } from "../Config/jwt_config";

class UserServices {
   private userRepository: UserRepository;

   constructor(userRepository: UserRepository) {
      this.userRepository = userRepository;
   }

   async loginUserService(email: string, password: string) {
      const userData = await this.userRepository.fineUser(email);
      if (userData) {
         const comparePassword = await bcrypt.compare(password, userData.password);
         if (comparePassword) {
            const userToken = createToken(userData.user_id as string);
            return {userToken, userData}
         } else {
            return "Wrong password";
         }
      } else {
         return "email not found";
      }
   }

   async registerUserService(userData: userType) {
      const alreadyExists = await this.userRepository.fineUser(userData.email);
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
      userData.user_id = uuid();
      return await this.userRepository.registerUserRepository(userData);
   }
}

export default UserServices;