import { Model } from "mongoose";
import { IUserRepository } from "../Interfaces/user.repository.interface";
import { IBookingDetails, IBookingHistory, IFollowedTechnician, IRatingReview, IReviewerDetail, ISingleRating, ITechnicians, IUser, IUserAddress, IUserWithITechnician } from "../Interfaces/common.interface";

class UserRepository implements IUserRepository {

  private userModel = Model<IUser>
  private bookingModel = Model<IBookingDetails>
  private ratingModel = Model<IRatingReview>

  constructor(userModel: Model<IUser>, bookingModel: Model<IBookingDetails>, ratingModel: Model<IRatingReview>) {
    this.userModel = userModel;
    this.bookingModel = bookingModel;
    this.ratingModel = ratingModel;
  }

  findByEmail = async (email: string): Promise<IUser | null> => {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      throw error;
    }
  };

  findByUser_id = async (user_id: string): Promise<IUser | null> => {
    try {
      return await this.userModel.findOne({ user_id: user_id });
    } catch (error) {
      throw error;
    }
  };

  login = async (email: string): Promise<IUserWithITechnician> => {
    try {
      const userDetails = await this.userModel.aggregate([
        { $match: { email: email } },
        { $lookup: { from: 'technicians', localField: 'user_id', foreignField: 'user_id', as: 'technicianDetails' } },
        { $project: { _id: 0, alreadychattedtechnician: 0, "technicianDetails._id": 0 } },
      ]);
      return userDetails[0];
    } catch (error) {
      throw error;
    }
  };

  register = async (userData: IUser): Promise<IUser> => {
    try {
      return await this.userModel.create(userData);
    } catch (error) {
      throw error;
    };
  };

  createUpdateAddress = async (addressData: IUserAddress, user_id: string): Promise<boolean> => {
    try {
      const updateResult = await this.userModel.updateOne({ user_id: user_id }, { $set: { addressDetails: addressData } });
      if (updateResult.modifiedCount === 1) {
        return true;
      } else {
        throw new Error("Failed to update address");
      };
    } catch (error) {
      throw error;
    };
  };

  deleteAddress = async (user_id: string): Promise<boolean> => {
    try {
      const updateResult = await this.userModel.updateOne({ user_id: user_id }, { $set: { addressDetails: null } });
      if (updateResult.modifiedCount === 1) {
        return true;
      } else {
        throw new Error("Failed to delete address");
      };
    } catch (error) {
      throw error
    };
  };

  accessIsTechnician = async (user_id: string): Promise<boolean> => {
    try {
      const updateResult = await this.userModel.updateOne({ user_id }, { isTechnician: true });
      if (updateResult.modifiedCount === 1) {
        return true;
      } else {
        throw new Error("Failed to access is technician");
      };
    } catch (error) {
      throw error;
    };
  };

  updatePassword = async (user_id: string, hashedNewPassword: string): Promise<boolean> => {
    try {
      const updateResult = await this.userModel.updateOne({ user_id: user_id }, { password: hashedNewPassword });
      if (updateResult.modifiedCount === 1) {
        return true;
      } else {
        throw new Error("Failed to upload password");
      };
    } catch (error) {
      throw error;
    };
  };

  updateProfileDetails = async (user_id: string, updatedInformation: { name: string, phone: string }): Promise<boolean> => {
    try {
      const updateResult = await this.userModel.updateOne({ user_id: user_id }, { $set: updatedInformation });
      if (updateResult.modifiedCount === 1) {
        return true;
      } else {
        throw new Error("Failed to update profile");
      };
    } catch (error) {
      throw error;
    };
  };

  updateProfileImage = async (user_id: string, imageName: string): Promise<boolean> => {
    try {
      const response = await this.userModel.updateOne({ user_id: user_id }, { profileIMG: imageName });
      if (response.modifiedCount === 1) {
        return true;
      } else {
        throw new Error("Failed to update user profile");
      };
    } catch (error) {
      throw error;
    };
  };

  followTechnician = async (user_id: string, technicianUser_id: string): Promise<boolean> => {
    try {
      const updateResult = await this.userModel.updateOne({ user_id: user_id }, { $addToSet: { savedTechnicians: technicianUser_id } });
      if (updateResult.modifiedCount === 1) {
        return true;
      } else {
        throw new Error("Failed to follow technician");
      };
    } catch (error) {
      throw error;
    };
  };

  unfollowTechnician = async (user_id: string, technicianUser_id: string): Promise<boolean> => {
    try {
      const updateResult = await this.userModel.updateOne({ user_id: user_id }, { $pull: { savedTechnicians: technicianUser_id } });
      if (updateResult.modifiedCount === 1) {
        return true;
      } else {
        throw new Error("Failed to unfollow technician");
      };
    } catch (error) {
      throw error;
    };
  };

  getFollowedTechnicians = async (user_id: string): Promise<IFollowedTechnician[]> => {
    try {
      const response = await this.userModel.aggregate([
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

  getTechnicians = async (user_id: string): Promise<ITechnicians[]> => {
    try {
      const result = await this.userModel.aggregate([
        { $match: { isTechnician: true, user_id: { $ne: user_id }, addressDetails: { $ne: null } } },
        { $lookup: { from: "technicians", localField: "user_id", foreignField: "user_id", as: "technicianDetails" } },
        { $unwind: "$technicianDetails" },
        {
          $project: {
            _id: 0,
            email: 0,
            phone: 0,
            password: 0,
            isBlocked: 0,
            isTechnician: 0,
            addressDetails: 0,
            savedTechnicians: 0,
            alreadychattedtechnician: 0,
            "technicianDetails._id": 0,
            "technicianDetails.user_id": 0,
            "technicianDetails.technician_id": 0,
            "technicianDetails.notifications": 0,
            "technicianDetails.availableSlots": 0,
          }
        },
      ]);
      return result;
    } catch (error) {
      throw error;
    };
  };

  getTechnicianWithPersonalDetails = async (technicianUser_id: string): Promise<IUserWithITechnician> => {
    try {
      const result = await this.userModel.aggregate([
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
            savedTechnicians: 0,
            "technicianDetails._id": 0,
            "technicianDetails.technician_id": 0,
            "ratingInformation._id": 0,
            "technicianDetails.notifications": 0,
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

  getTechnicianDetails = async (technicianUserID: string): Promise<IUserWithITechnician> => {
    try {
      const result = await this.userModel.aggregate([
        { $match: { user_id: technicianUserID } },
        { $lookup: { from: "technicians", localField: "user_id", foreignField: "user_id", as: "technicianDetails" } },
        { $unwind: "$technicianDetails" },
        { $project: { _id: 0, password: 0 } },
      ]);
      return result[0];
    } catch (error) {
      throw error;
    };
  };

  getChatFriends = async (user_id: string): Promise<IReviewerDetail[]> => {
    try {
      return await this.userModel.aggregate([
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

  createConnectionToChatFriends = async (user_id: string, technicianUser_id: string): Promise<boolean> => {
    try {
      const updateResult = await this.userModel.bulkWrite([
        {
          updateOne: {
            filter: { user_id: user_id },
            update: { $addToSet: { alreadychattedtechnician: technicianUser_id } }
          },
        },
        {
          updateOne: {
            filter: { user_id: technicianUser_id },
            update: { $addToSet: { alreadychattedtechnician: user_id } }
          },
        },
      ]);
      if (updateResult.modifiedCount === 2) {
        return true;
      } else {
        throw new Error("Failed to create connection");
      };
    } catch (error) {
      throw error;
    };
  };

  bookTechnician = async (newBookingDetails: IBookingDetails): Promise<IBookingDetails> => {
    try {
      return await this.bookingModel.create(newBookingDetails);
    } catch (error) {
      throw error;
    }
  };

  getBookingsHistory = async (user_id: string): Promise<IBookingHistory[]> => {
    try {
      return await this.bookingModel.aggregate([
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

  getBookingDetails = async (booking_id: string): Promise<IBookingDetails> => {
    try {
      const response = await this.bookingModel.aggregate([
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
          },
        },
      ]);
      return response[0];
    } catch (error) {
      throw error;
    };
  };

  cancelBooking = async (booking_id: string): Promise<boolean> => {
    try {
      const updateResult = await this.bookingModel.updateOne({ booking_id: booking_id }, { $set: { booking_status: "Cancelled" } });
      if (updateResult.modifiedCount === 1) {
        return true;
      } else {
        throw new Error("Failed to cancel booking");
      };
    } catch (error) {
      throw error;
    };
  };

  updateBookingPaymentStatus = async (booking_id: string, payment_status: string): Promise<boolean> => {
    try {
      const updateResult = await this.bookingModel.updateOne({ booking_id: booking_id }, { payment_status: payment_status });
      if (updateResult.modifiedCount === 1) {
        return true;
      } else {
        throw new Error("Failed to update booking payment status");
      };
    } catch (error) {
      throw error;
    };
  };

  updateBookingReviewAdded = async (booking_id: string, reviewAdded: boolean): Promise<boolean> => {
    try {
      const updateResult = await this.bookingModel.updateOne({ booking_id: booking_id }, { reviewAdded: reviewAdded });
      if (updateResult.modifiedCount === 1) {
        return true;
      } else {
        throw new Error("Failed to update booking review added");
      };
    } catch (error) {
      throw error;
    };
  };

  addNewFeedbackToTechnician = async (technician_id: string, feedbackInformation: ISingleRating): Promise<boolean> => {
    try {
      const updateResult = await this.ratingModel.updateOne({ user_id: technician_id }, { $push: { reviews: feedbackInformation } });
      if (updateResult.modifiedCount === 1) {
        return true;
      } else {
        throw new Error("Failed to added feedback");
      };
    } catch (error) {
      throw error;
    };
  };

  userIsBlocked = async (user_id: string): Promise<boolean> => {
    try {
      const userDetails: IUser | null = await this.userModel.findOne({ user_id: user_id });
      if (userDetails?.isBlocked === true) {
        return true;
      };
      return false
    } catch (error) {
      throw error;
    }
  };

};

export default UserRepository;