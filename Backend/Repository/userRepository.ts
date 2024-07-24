import { userModel, userType } from "../Model/userModal";

class UserRepository {

  async fineUser(email: string) {
    return await userModel.findOne({ email: email });
  }

  async registerUserRepository(userData: userType) {
    return await userModel.create(userData);
  }

}

export default UserRepository;