import { technicianModel, technicianType } from "../Model/technicianModel";
import BookingModel from "../Model/bookingModel";

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
        { $lookup: { from: "users", localField: "client_id", foreignField: "user_id", as: "userDetails" } },
        { $unwind: "$userDetails" },
        { $project: { _id: 0, client_id: 0, technicianUser_id: 0, "userDetails.isBlocked": 0, "userDetails.isTechnician": 0, "userDetails.password": 0, "userDetails.user_id": 0, "userDetails._id": 0 } }
      ]);
    } catch (error) {
      throw error;
    }
  }

}

export default TechnicianRepository;