import { userModel, userType } from "../Model/userModal";

class UserRepository {

  async registerUserRepository(userData: userType) {
    return userModel.create(userData);
  }
  
}

export default UserRepository;