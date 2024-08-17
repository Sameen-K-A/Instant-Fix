import User from "../Model/userModal";
import { userAddressType, userType } from "../Interfaces";
import BookingModel from "../Model/bookingModel"
import { newBookingType } from "../Interfaces";

class UserRepository {

  async findUserByEmail(email: string) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw error;
    }
  };

  async findUserByUser_id(user_id: string) {
    try {
      return await User.findOne({ user_id: user_id });
    } catch (error) {
      throw error;
    }
  };

  async loginUserRepository(email: string) {
    try {
      const userDetails = await User.aggregate([
        { $match: { email: email } },
        { $lookup: { from: 'technicians', localField: 'user_id', foreignField: 'user_id', as: 'technicianDetails' } },
        { $project: { _id: 0, alreadychattedtechnician: 0 } },
      ]);
      return userDetails[0];
    } catch (error) {
      throw error;
    }
  };

  async registerUserRepository(userData: userType) {
    try {
      return await User.create(userData);
    } catch (error) {
      throw error;
    }
  };

  async add_EditAddressRepository(addressData: userAddressType, user_id: string) {
    try {
      return await User.updateOne({ user_id: user_id }, { $set: { addressDetails: addressData } },);
    } catch (error) {
      throw error;
    }
  };

  async deleteAddressRepository(user_id: string) {
    try {
      return await User.updateOne({ user_id: user_id }, { $set: { addressDetails: null } });
    } catch (error) {
      throw error
    }
  };

  async accessIsTechnician(user_id: string) {
    try {
      return await User.updateOne({ user_id }, { isTechnician: true });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  async changepasswordRepository(user_id: string, hashedNewPassword: string) {
    try {
      return await User.updateOne({ user_id: user_id }, { password: hashedNewPassword });
    } catch (error) {
      throw error;
    }
  };

  async editProfileRepository(user_id: string, updatedInformation: { name: string, phone: string, profileIMG?: string }) {
    try {
      return await User.updateOne({ user_id: user_id }, { $set: updatedInformation });
    } catch (error) {
      throw error;
    }
  };

  async fetchTechnicianRepository(user_id: string, skipCount: number = 0, limitCount: number = 10) {
    try {
      return await User.aggregate([
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
      return await User.aggregate([
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
      return await User.aggregate([
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
      return await User.bulkWrite([
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
  };

  async fetchUserBookingHistoryRepository(user_id: string) {
    try {
      return await BookingModel.aggregate([
        { $match: { client_id: user_id } },
        { $lookup: { from: "users", localField: "technicianUser_id", foreignField: "user_id", as: "technicianPersonal" } },
        { $unwind: "$technicianPersonal" },
        {
          $project: {
            _id: 0,
            "technicianPersonal._id": 0,
            "technicianPersonal.addressDetails": 0,
            "technicianPersonal.alreadychattedtechnician": 0,
            "technicianPersonal.isBlocked": 0,
            "technicianPersonal.isTechnician": 0,
            "technicianPersonal.password": 0,
            "technicianPersonal.email": 0,
            "technicianPersonal.phone": 0,
            "technicianPersonal.profileIMG": 0,
            "technicianPersonal.user_id": 0,
          },
        },
      ]);
    } catch (error) {
      throw error;
    }
  };

  async fetchIndividualBookingInformationRepository(booking_id: string) {
    try {
      const response = await BookingModel.aggregate([
        { $match: { booking_id: booking_id } },
        { $lookup: { from: "users", localField: "technicianUser_id", foreignField: "user_id", as: "technicianDetails" } },
        { $unwind: "$technicianDetails" },
        {
          $project: {
            _id: 0,
            "technicianDetails._id": 0,
            "technicianDetails.user_id": 0,
            "technicianDetails.password": 0,
            "technicianDetails.isBlocked": 0,
            "technicianDetails.isTechnician": 0,
            "technicianDetails.addressDetails": 0,
            "technicianDetails.alreadychattedtechnician": 0,
          }
        }
      ]);
      return response[0];
    } catch (error) {
      throw error;
    }
  }

};

export default UserRepository;