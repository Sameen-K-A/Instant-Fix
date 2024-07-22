import UserRepository from "../Repository/userRepository";
import bcrypt from 'bcrypt';
import { userType } from "../Model/userModal";

class UserServices {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async registerUserService(userData: userType) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const OTP: string = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(OTP);
  }
}

export default UserServices;