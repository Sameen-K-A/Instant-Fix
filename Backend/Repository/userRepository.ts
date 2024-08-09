import { userModel, userType } from "../Model/userModal";
import { userAddressModal, userAddressType } from "../Model/userAddressModal";
import BookingModel from "../Model/bookingModel"
import { editAddressType, newBookingType } from "../Interfaces";

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

  async loginUserRepository(email: string) {
    try {
      const userDetails = await userModel.aggregate([
        { $match: { email: email } },
        { $lookup: { from: 'technicians', localField: 'user_id', foreignField: 'user_id', as: 'technicianDetails' } }
      ]);
      return userDetails[0];
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
  };

  async fetchTechnicianRepository(user_id: string, skipCount: number = 0, limitCount: number = 10) {
    try {
      return await userModel.aggregate([
        { $match: { isTechnician: true, user_id: { $ne: user_id } } },
        { $lookup: { from: "technicians", localField: "user_id", foreignField: "user_id", as: "technicianDetails" } },
        { $skip: skipCount },
        { $limit: limitCount }
      ]);
    } catch (error) {
      console.log("Fetch technician repository error : ", error);
      throw error;
    }
  };

  async fetchSingleTechnicianDetailsRepository(technicianUserID: string): Promise<any[]> {
    try {
      return await userModel.aggregate([
        { $match: { user_id: technicianUserID } },
        { $lookup: { from: "technicians", localField: "user_id", foreignField: "user_id", as: "technicianDetails" } },
        { $unwind: "$technicianDetails" },
        { $project: { _id: 0, password: 0 } },
      ]);
    } catch (error) {
      throw error;
    };
  };

  async fetchAlreadyChattedTechniciansRepository(user_id: string) {
    try {
      return await userModel.aggregate([
        { $match: { user_id: user_id } },
        { $unwind: "$alreadychattedtechnician" },
        { $lookup: { from: "users", localField: "alreadychattedtechnician", foreignField: "user_id", as: "technicianPersonalDetails" } },
        { $unwind: "$technicianPersonalDetails" },
        { $project: { "technicianPersonalDetails.name": 1, "technicianPersonalDetails.profileIMG": 1, "technicianPersonalDetails.user_id": 1, _id: 0 } }
      ]);
    } catch (error) {
      throw error;
    };
  };

  async addNewConnectionToAlreadyChattedTechnicianListRepository(user_id: string, technicianUser_id: string) {
    try {
      return await userModel.bulkWrite([
        {
          updateOne: {
            filter: { user_id: user_id },
            update: { $addToSet: { alreadychattedtechnician: technicianUser_id } }
          }
        },
        {
          updateOne: {
            filter: { user_id: technicianUser_id },
            update: { $addToSet: { alreadychattedtechnician: user_id } }
          }
        }
      ]);
    } catch (error) {
      throw error;
    }
  };

  async bookTechnicianRepository(newBookingDetails: newBookingType) {
    try {
      return await BookingModel.create(newBookingDetails);
    } catch (error) {
      throw error;
    }
  };

  async fetchAnyPendingRequestAvailableRepository(clientID: string, technicianUserID: string) {
    try {
      return await BookingModel.findOne({
        client_id: clientID,
        technicianUser_id: technicianUserID,
        booking_status: { $in: ["Pending", "Requested"] }
      });
    } catch (error) {
      throw error;
    }
  }

};

export default UserRepository;