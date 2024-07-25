import { userModel, userType } from "../Model/userModal";
import { userAddressModal, userAddressType } from "../Model/userAddressModal";

class UserRepository {

  async fineUser(email: string) {
    return await userModel.findOne({ email: email });
  }

  async registerUserRepository(userData: userType) {
    return await userModel.create(userData);
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

}

export default UserRepository;