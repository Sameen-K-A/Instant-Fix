import { userModel, userType } from "../Model/userModal";
import { userAddressModal, userAddressType } from "../Model/userAddressModal";
import { editAddressType } from "../Interfaces";

class UserRepository {

   async findUserByEmail(email: string) {
      try {
         return await userModel.findOne({ email });
      } catch (error) {
         throw error;
      }
   };

   async findUserByUser_id(user_id: string) {
      try {
         return await userModel.findOne({ user_id: user_id });
      } catch (error) {
         throw error;
      }
   };

   async registerUserRepository(userData: userType) {
      try {
         return await userModel.create(userData);
      } catch (error) {
         throw error;
      }
   };

   async fetchAddressRepository(user_id: string) {
      try {
         return await userAddressModal.find({ user_id: user_id });
      } catch (error) {
         throw error;
      }
   };

   async addAddressRepository(addressData: userAddressType) {
      try {
         return await userAddressModal.create(addressData);
      } catch (error) {
         throw error;
      }
   };

   async editAddressRepository(address_id: string, editedAddressData: editAddressType) {
      try {
         return await userAddressModal.updateOne({ address_id }, { $set: editedAddressData });
      } catch (error) {
         throw error;
      }
   }

   async deleteAddressRepository(address_id: string) {
      try {
         return await userAddressModal.deleteOne({ address_id: address_id });
      } catch (error) {
         throw error
      }
   };

   async accessIsTechnician(user_id: string) {
      try {
         return await userModel.updateOne({ user_id }, { isTechnician: true });
      } catch (error) {
         console.log(error);
         throw error;
      }
   };

   async changepasswordRepository(user_id: string, hashedNewPassword: string) {
      try {
         return await userModel.updateOne({ user_id: user_id }, { password: hashedNewPassword });
      } catch (error) {
         throw error;
      }
   };

   async editProfileRepository(user_id: string, updatedInformation: { name: string, phone: string, profileIMG?: string }) {
      try {
         return await userModel.updateOne({ user_id: user_id }, { $set: updatedInformation });
      } catch (error) {
         throw error;
      }
   }
};

export default UserRepository;