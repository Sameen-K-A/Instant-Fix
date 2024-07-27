import { userModel, userType } from "../Model/userModal";
import { userAddressModal, userAddressType } from "../Model/userAddressModal";

class UserRepository {

  async findUser(email: string) {
    try {
      return await userModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async registerUserRepository(userData: userType) {
    try {
      return await userModel.create(userData);
    } catch (error) {
      throw error;
    }
  }

  async fetchAddressRepository(user_id: string) {
    return await userAddressModal.find({ user_id: user_id });
  }

  async addAddressRepository(addressData: userAddressType) {
    return await userAddressModal.create(addressData);
  }

  async deleteAddressRepository(address_id: string) {
    return await userAddressModal.deleteOne({ address_id: address_id });
  }

  async accessIsTechnician(user_id: string) {
    try {
      return await userModel.updateOne({ user_id }, { isTechnician: true });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}

export default UserRepository;