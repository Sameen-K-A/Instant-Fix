import { technicianModel, technicianType } from "../Model/technicianModel";
import BookingModel from "../Model/bookingModel";
import Rating from "../Model/ReviewModal";
import { slotType, RatingReviewType } from "../Interfaces";

class TechnicianRepository {

  async joinNewTechnicianRepository(technicianData: technicianType) {
    try {
      return await technicianModel.create(technicianData);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  async changeProfessionRepository(user_id: string, profession: string) {
    try {
      return await technicianModel.updateOne({ user_id: user_id }, { $set: { profession: profession } });
    } catch (error) {
      throw error;
    }
  };

  async changeAvailabilityStatusRepository(user_id: string, newStatus: boolean) {
    try {
      return await technicianModel.updateOne({ user_id: user_id }, { $set: { availability: newStatus } });
    } catch (error) {
      throw error;
    }
  };

  async fetchTechnicianBookingHistoryRepository(technicianUserID: string) {
    try {
      return await BookingModel.aggregate([
        { $match: { technicianUser_id: technicianUserID } },
        { $sort: { _id: -1 } },
        { $lookup: { from: "users", localField: "client_id", foreignField: "user_id", as: "userDetails" } },
        { $unwind: "$userDetails" },
        { $project: { _id: 0, client_id: 0, technicianUser_id: 0, "userDetails.isBlocked": 0, "userDetails.isTechnician": 0, "userDetails.password": 0, "userDetails.user_id": 0, "userDetails._id": 0 } }
      ]);
    } catch (error) {
      throw error;
    }
  };

  async fetchTechnicianInformationRepository(technicianUser_id: string) {
    try {
      return await technicianModel.findOne({ user_id: technicianUser_id }, { _id: 0 });
    } catch (error) {
      throw error
    }
  };

  async fetchingIndividualBookingDetailsRepository(booking_id: string) {
    try {
      const response = await BookingModel.aggregate([
        { $match: { booking_id: booking_id } },
        { $lookup: { from: "users", localField: "client_id", foreignField: "user_id", as: "userDetails" } },
        { $unwind: "$userDetails" },
        {
          $project: {
            _id: 0,
            "userDetails._id": 0,
            "userDetails.user_id": 0,
            "userDetails.password": 0,
            "userDetails.isBlocked": 0,
            "userDetails.profileIMG": 0,
            "userDetails.isTechnician": 0,
            "userDetails.addressDetails": 0,
            "userDetails.alreadychattedtechnician": 0,
          }
        }
      ]);
      return response[0];
    } catch (error) {
      throw error;
    }
  };

  async acceptRejectCancelNewBookingRepository(booking_id: string, status: string) {
    try {
      return await BookingModel.updateOne({ booking_id: booking_id }, { $set: { booking_status: status } });
    } catch (error) {
      throw error;
    }
  };

  async modifyAvailableSlotsRepository(technician_id: string, availableSlots: slotType[]) {
    try {
      const response = await technicianModel.updateOne(
        { user_id: technician_id },
        { $set: { availableSlots: availableSlots } },
      );
      return response;
    } catch (error) {
      throw error;
    };
  };

  async completeBookingRepository(booking_id: string, laborCharge: string, completeDate: string) {
    try {
      return await BookingModel.updateOne({ booking_id: booking_id }, { booking_status: "Completed", serviceCost: laborCharge, serviceCompletedDate: completeDate, Payment_Status: "Requested" })
    } catch (error) {
      throw error;
    };
  };

  async clearNotificationRepository(technicianUser_id: string) {
    try {
      return await technicianModel.updateOne({ user_id: technicianUser_id }, { $set: { notifications: [] } });
    } catch (error) {
      throw error;
    };
  };

  async changeTechncianSlotAfterBookingRepository(technicianUser_id: string, selectedDate: string) {
    try {
      return await technicianModel.updateOne(
        { user_id: technicianUser_id, "availableSlots.slotDate": selectedDate },
        { $set: { "availableSlots.$.slotBooked": true } }
      );
    } catch (error) {
      throw error;
    };
  };

  async changeTechncianSlotAfterBookingCancelRepository(technicianUser_id: string, selectedDate: string) {
    try {
      return await technicianModel.updateOne(
        { user_id: technicianUser_id, "availableSlots.slotDate": selectedDate },
        { $set: { "availableSlots.$.slotBooked": false } }
      );
    } catch (error) {
      throw error;
    };
  };

  async addNewNotification(technicianUser_id: string, notification: string) {
    try {
      return await technicianModel.updateOne({ user_id: technicianUser_id }, { $push: { notifications: notification } })
    } catch (error) {
      throw error;
    };
  };

  async createRatingDetails(ratingDetails: RatingReviewType) {
    try {
      return await Rating.create(ratingDetails);
    } catch (error) {
      throw error;
    };
  };

  async fetchAllFeedbacks(technician_id: string) {
    try {
      return await Rating.findOne({ user_id: technician_id });
    } catch (error) {
      throw error;
    };
  };

  async updateNewAvgRatingToTechnician(technician_id: string, newRating: number) {
    try {
      return await technicianModel.updateOne({ user_id: technician_id }, { rating: newRating });
    } catch (error) {
      throw error;
    };
  };

  async fetchningRatingWithReviewerDetailsRepository(technicianUser_id: string) {
    try {
      const res = await Rating.aggregate([
        { $match: { user_id: technicianUser_id } },
        { $lookup: { from: "users", localField: "reviews.rated_user_id", foreignField: "user_id", as: "reviewerDetails" } },
        { $lookup: { from: "technicians", localField: "user_id", foreignField: "user_id", as: "technicianRating" } },
        { $unwind: "$technicianRating" },
        {
          $project:
          {
            _id: 0,
            user_id: 0,
            "technicianRating._id": 0,
            "technicianRating.user_id": 0,
            "technicianRating.technician_id": 0,
            "technicianRating.profession": 0,
            "technicianRating.availability": 0,
            "technicianRating.notifications": 0,
            "technicianRating.availableSlots": 0,
          },
        },
      ]);
      return res[0];
    } catch (error) {
      throw error;
    };
  };

};

export default TechnicianRepository;