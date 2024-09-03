import User from "../Model/userModal";
import { SingleRatingType, userAddressType, userType } from "../interfaces";
import BookingModel from "../Model/bookingModel"
import { newBookingType } from "../interfaces";
import Rating from "../Model/reviewModal";

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

  async saveTechnicianRepository(user_id: string, technicianUser_id: string) {
    try {
      return await User.updateOne({ user_id: user_id }, { $addToSet: { savedTechnicians: technicianUser_id } });
    } catch (error) {
      throw error;
    };
  };

  async unSaveTechnicianRepository(user_id: string, technicianUser_id: string) {
    try {
      return await User.updateOne({ user_id: user_id }, { $pull: { savedTechnicians: technicianUser_id } });
    } catch (error) {
      throw error;
    };
  };

  async fetchSavedTechnicianDetailsRepository(user_id: string) {
    try {
      const response = await User.aggregate([
        { $match: { user_id: user_id } },
        { $unwind: "$savedTechnicians" },
        { $lookup: { from: "users", localField: "savedTechnicians", foreignField: "user_id", as: "SavedTechnicianPersonalInformation" } },
        { $unwind: "$SavedTechnicianPersonalInformation" },
        { $lookup: { from: "technicians", localField: "savedTechnicians", foreignField: "user_id", as: "SavedTechnicianProfessionInformation" } },
        { $unwind: "$SavedTechnicianProfessionInformation" },
        {
          $project: {
            _id: 0,
            "SavedTechnicianPersonalInformation.user_id": 1,
            "SavedTechnicianPersonalInformation.name": 1,
            "SavedTechnicianPersonalInformation.profileIMG": 1,
            "SavedTechnicianProfessionInformation.profession": 1
          },
        },
      ]);
      return response;
    } catch (error) {
      throw error;
    };
  };

  async fetchTechnicianRepository(user_id: string, skipCount: number = 0, limitCount: number = 10) {
    try {
      return await User.aggregate([
        { $match: { isTechnician: true, user_id: { $ne: user_id }, addressDetails: { $ne: null } } },
        { $lookup: { from: "technicians", localField: "user_id", foreignField: "user_id", as: "technicianDetails" } },
        { $unwind: "$technicianDetails" },
        {
          $project: {
            _id: 0,
            password: 0,
            isBlocked: 0,
            isTechnician: 0,
            alreadychattedtechnician: 0,
            "technicianDetails._id": 0,
          }
        },
        { $skip: skipCount },
        { $limit: limitCount },
      ]);
    } catch (error) {
      console.log("Fetch technician repository error : ", error);
      throw error;
    }
  };

  async fetchTechnicianIndividualInformationRepository(technicianUser_id: string) {
    try {
      const result = await User.aggregate([
        { $match: { user_id: technicianUser_id } },
        { $lookup: { from: "technicians", localField: "user_id", foreignField: "user_id", as: "technicianDetails" } },
        { $unwind: "$technicianDetails" },
        { $lookup: { from: "ratings", localField: "user_id", foreignField: "user_id", as: "ratingInformation" } },
        { $unwind: "$ratingInformation" },
        { $lookup: { from: "users", localField: "ratingInformation.reviews.rated_user_id", foreignField: "user_id", as: "reviewerDetails" } },
        {
          $project: {
            _id: 0,
            password: 0,
            isBlocked: 0,
            isTechnician: 0,
            addressDetails: 0,
            alreadychattedtechnician: 0,
            "technicianDetails._id": 0,
            "technicianDetails.technician_id": 0,
            "ratingInformation._id": 0,
            "ratingInformation.user_id": 0,
            "reviewerDetails._id": 0,
            "reviewerDetails.email": 0,
            "reviewerDetails.phone": 0,
            "reviewerDetails.isBlocked": 0,
            "reviewerDetails.isTechnician": 0,
            "reviewerDetails.savedTechnicians": 0,
            "reviewerDetails.addressDetails": 0,
            "reviewerDetails.alreadychattedtechnician": 0,
            "reviewerDetails.password": 0,
          },
        },
      ]);

      return result[0];
    } catch (error) {
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

  async fetchUserBookingHistoryRepository(user_id: string) {
    try {
      return await BookingModel.aggregate([
        { $match: { client_id: user_id } },
        { $lookup: { from: "users", localField: "technicianUser_id", foreignField: "user_id", as: "technicianPersonal" } },
        { $unwind: "$technicianPersonal" },
        { $sort: { _id: -1 } },
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
            "technicianDetails.password": 0,
            "technicianDetails.isBlocked": 0,
            "technicianDetails.isTechnician": 0,
            "technicianDetails.addressDetails": 0,
            "technicianDetails.alreadychattedtechnician": 0,
            "technicianDetails.savedTechnicians": 0,
          }
        }
      ]);
      return response[0];
    } catch (error) {
      throw error;
    }
  };

  async cancelBookingRepository(booking_id: string) {
    try {
      return await BookingModel.updateOne({ booking_id: booking_id }, { $set: { booking_status: "Cancelled" } });
    } catch (error) {
      throw error;
    };
  };

  async updateBookingPaymentStatus(booking_id: string, Payment_Status: string) {
    try {
      return await BookingModel.updateOne({ booking_id: booking_id }, { Payment_Status: Payment_Status });
    } catch (error) {
      throw error;
    };
  };

  async updateBookingReviewAdded(booking_id: string, reviewAdded: boolean) {
    try {
      return await BookingModel.updateOne({ booking_id: booking_id }, { reviewAdded: reviewAdded });
    } catch (error) {
      throw error;
    };
  };

  async addNewFeedbackToTechnician(technician_id: string, feedbackInformation: SingleRatingType) {
    try {
      return await Rating.updateOne({ user_id: technician_id }, { $push: { reviews: feedbackInformation } });
    } catch (error) {
      throw error;
    };
  };

};

export default UserRepository;