import BookingModel from "../Model/bookingModel";
import Rating from "../Model/reviewModal";
import { slotType, RatingReviewType, technicianType } from "../interfaces";
import { IBookingDetails, IBookingHistory, IFeedbackRepository, ITechnicianDetails, ITechnicianRepository } from "../Interfaces/techinicianInterfaces";
import { Model, UpdateWriteOpResult } from "mongoose";

export class TechnicianRepository implements ITechnicianRepository {
  private technicianModel: Model<ITechnicianDetails>;

  constructor(technicianModel: Model<ITechnicianDetails>) {
    this.technicianModel = technicianModel;
  }

  async createTechnicianRepository(technicianData: technicianType): Promise<ITechnicianDetails> {
    try {
      return await this.technicianModel.create(technicianData);
    } catch (error) {
      console.error('Error creating technician:', error);
      throw error;
    }
  };

  async changeProfessionRepository(user_id: string, profession: string): Promise<UpdateWriteOpResult> {
    try {
      return await this.technicianModel.updateOne({ user_id: user_id }, { $set: { profession: profession } });
    } catch (error) {
      console.error('Error changing profession:', error);
      throw error;
    }
  };

  async changeAvailabilityStatusRepository(user_id: string, newStatus: boolean): Promise<UpdateWriteOpResult> {
    try {
      return await this.technicianModel.updateOne({ user_id: user_id }, { $set: { availability: newStatus } });
    } catch (error) {
      console.error('Error changing availability status:', error);
      throw error;
    }
  };

  async fetchTechnicianBookingHistoryRepository(technicianUserID: string): Promise<IBookingHistory[]> {
    try {
      return await BookingModel.aggregate([
        { $match: { technicianUser_id: technicianUserID } },
        { $sort: { _id: -1 } },
        { $lookup: { from: "users", localField: "client_id", foreignField: "user_id", as: "userDetails" } },
        { $unwind: "$userDetails" },
        {
          $project: {
            _id: 0,
            client_id: 0,
            technicianUser_id: 0,
            Booking_profession: 0,
            serviceCompletedDate: 0,
            serviceCost: 0,
            serviceLocation: 0,
            Payment_Status: 0,
            reviewAdded: 0,
            serviceDate: 0,
            "userDetails.isBlocked": 0,
            "userDetails.isTechnician": 0,
            "userDetails.password": 0,
            "userDetails.user_id": 0,
            "userDetails._id": 0,
            "userDetails.email": 0,
            "userDetails.phone": 0,
            "userDetails.profileIMG": 0,
            "userDetails.addressDetails": 0,
            "userDetails.alreadychattedtechnician": 0,
            "userDetails.savedTechnicians": 0,
          }
        }
      ]);
    } catch (error) {
      console.error('Error fetching technician booking history:', error);
      throw error;
    }
  };

  async fetchTechnicianInformationRepository(technicianUser_id: string): Promise<ITechnicianDetails | null> {
    try {
      return await this.technicianModel.findOne({ user_id: technicianUser_id }, { _id: 0 });
    } catch (error) {
      console.error('Error fetching technician information:', error);
      throw error;
    }
  };

  async fetchingIndividualBookingDetailsRepository(booking_id: string): Promise<IBookingDetails> {
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
            "userDetails.savedTechnicians": 0,
          },
        },
      ]);
      return response[0];
    } catch (error) {
      console.error('Error fetching individual booking details:', error);
      throw error;
    }
  };

  async acceptRejectCancelNewBookingRepository(booking_id: string, status: string): Promise<UpdateWriteOpResult> {
    try {
      return await BookingModel.updateOne({ booking_id: booking_id }, { $set: { booking_status: status } });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  };

  async modifyAvailableSlotsRepository(technician_id: string, availableSlots: slotType[]): Promise<UpdateWriteOpResult> {
    try {
      return await this.technicianModel.updateOne(
        { user_id: technician_id },
        { $set: { availableSlots: availableSlots } },
      );
    } catch (error) {
      console.error('Error modifying available slots:', error);
      throw error;
    }
  };

  async completeBookingRepository(booking_id: string, laborCharge: string, completeDate: string): Promise<UpdateWriteOpResult> {
    try {
      return await BookingModel.updateOne({ booking_id: booking_id }, {
        $set: {
          booking_status: "Completed",
          serviceCost: laborCharge,
          serviceCompletedDate: completeDate,
          Payment_Status: "Requested"
        }
      });
    } catch (error) {
      console.error('Error completing booking:', error);
      throw error;
    }
  };

  async clearNotificationRepository(technicianUser_id: string): Promise<UpdateWriteOpResult> {
    try {
      return await this.technicianModel.updateOne({ user_id: technicianUser_id }, { $set: { notifications: [] } });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  };

  async changeTechncianSlotAfterBookingRepository(technicianUser_id: string, selectedDate: string): Promise<UpdateWriteOpResult> {
    try {
      return await this.technicianModel.updateOne(
        { user_id: technicianUser_id, "availableSlots.slotDate": selectedDate },
        { $set: { "availableSlots.$.slotBooked": true } }
      );
    } catch (error) {
      console.error('Error changing technician slot after booking:', error);
      throw error;
    }
  };

  async changeTechncianSlotAfterBookingCancelRepository(technicianUser_id: string, selectedDate: string): Promise<UpdateWriteOpResult> {
    try {
      return await this.technicianModel.updateOne(
        { user_id: technicianUser_id, "availableSlots.slotDate": selectedDate },
        { $set: { "availableSlots.$.slotBooked": false } }
      );
    } catch (error) {
      console.error('Error changing technician slot after booking cancellation:', error);
      throw error;
    }
  };

  async addNewNotificationRepository(technicianUser_id: string, notification: string): Promise<UpdateWriteOpResult> {
    try {
      return await this.technicianModel.updateOne({ user_id: technicianUser_id }, { $push: { notifications: notification } });
    } catch (error) {
      console.error('Error adding new notification:', error);
      throw error;
    }
  };

  async createRatingDetailsRepository(ratingDetails: RatingReviewType): Promise<RatingReviewType> {
    try {
      return await Rating.create(ratingDetails);
    } catch (error) {
      console.error('Error creating rating details:', error);
      throw error;
    }
  };

  async fetchAllFeedbacksRepository(technician_id: string): Promise<IFeedbackRepository | null> {
    try {
      return await Rating.findOne({ user_id: technician_id }, { _id: 0 });
    } catch (error) {
      console.error('Error fetching all feedbacks:', error);
      throw error;
    }
  };

  async updateNewAvgRatingToTechnicianRepository(technician_id: string, newRating: number): Promise<UpdateWriteOpResult> {
    try {
      return await this.technicianModel.updateOne({ user_id: technician_id }, { rating: newRating });
    } catch (error) {
      console.error('Error updating new average rating to technician:', error);
      throw error;
    }
  };

  async fetchningRatingWithReviewerDetailsRepository(technicianUser_id: string): Promise<IFeedbackRepository> {
    try {
      const res = await Rating.aggregate([
        { $match: { user_id: technicianUser_id } },
        { $lookup: { from: "users", localField: "reviews.rated_user_id", foreignField: "user_id", as: "reviewerDetails" } },
        { $lookup: { from: "technicians", localField: "user_id", foreignField: "user_id", as: "technicianRating" } },
        { $unwind: "$technicianRating" },
        {
          $project: {
            _id: 0,
            "reviews._id": 0,
            "reviews.rated_user_id": 0,
            "reviews.user_id": 0,
            "reviews.createdAt": 0,
            "reviews.updatedAt": 0,
            "technicianRating._id": 0,
            "technicianRating.user_id": 0,
            "technicianRating.__v": 0,
            "technicianRating.isTechnician": 0,
            "technicianRating.email": 0,
            "technicianRating.phone": 0,
            "technicianRating.addressDetails": 0,
            "technicianRating.savedTechnicians": 0,
            "technicianRating.alreadychattedtechnician": 0,
            "technicianRating.profileIMG": 0,
          }
        },
        { $unwind: "$reviewerDetails" }
      ]);
      return res[0];
    } catch (error) {
      console.error('Error fetching rating with reviewer details:', error);
      throw error;
    }
  };
}

export default TechnicianRepository;