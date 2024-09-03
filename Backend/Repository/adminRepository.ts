import User from "../Model/userModal";
import BookingModel from "../Model/bookingModel";
import { IAdminRepository, IBookings, IUsers, ITechnicians } from "../Interfaces/adminInterfaces";
import { UpdateWriteOpResult } from "mongoose";

class AdminRepository implements IAdminRepository {

   async fetchUserRepository(): Promise<IUsers[]> {
      try {
         return await User.aggregate([
            { $match: {} },
            { $sort: { _id: -1 } },
            { $project: { _id: 0, password: 0, profileIMG: 0, isTechnician: 0, addressDetails: 0, alreadychattedtechnician: 0, savedTechnicians: 0 } },
         ]);
      } catch (error) {
         console.log("Error from database : ", error);
         throw error;
      };
   };

   async unblockUserRepository(user_id: string): Promise<UpdateWriteOpResult> {
      try {
         return await User.updateOne({ user_id }, { isBlocked: false });
      } catch (error) {
         console.log("Error from database:", error);
         throw error;
      };
   };

   async blockUserRepository(user_id: string): Promise<UpdateWriteOpResult> {
      try {
         return await User.updateOne({ user_id }, { isBlocked: true });
      } catch (error) {
         console.log("Error from database:", error);
         throw error;
      };
   };

   async fetchTechnicianRepository(): Promise<ITechnicians[]> {
      try {
         return await User.aggregate([
            { $match: { isTechnician: true } },
            { $lookup: { from: "technicians", localField: "user_id", foreignField: "user_id", as: "technicianDetails" } },
            { $unwind: "$technicianDetails" },
            { $sort: { _id: -1 } },
            {
               $project: {
                  _id: 0,
                  password: 0,
                  profileIMG: 0,
                  isTechnician: 0,
                  addressDetails: 0,
                  alreadychattedtechnician: 0,
                  savedTechnicians: 0,
                  "technicianDetails._id": 0,
                  "technicianDetails.user_id": 0,
                  "technicianDetails.technician_id": 0,
                  "technicianDetails.availability": 0,
                  "technicianDetails.rating": 0,
                  "technicianDetails.notifications": 0,
                  "technicianDetails.availableSlots": 0,
               },
            },
         ]);
      } catch (error) {
         console.log("Fetch technician repository error : ", error);
         throw error;
      };
   };

   async fetchBookingsRepository(): Promise<IBookings[]> {
      try {
         return await BookingModel.aggregate([
            { $match: {} },
            { $sort: { _id: -1 } },
            { $lookup: { from: "users", localField: "technicianUser_id", foreignField: "user_id", as: "technicianDetails" } },
            { $unwind: "$technicianDetails" },
            { $lookup: { from: "users", localField: "client_id", foreignField: "user_id", as: "userDetails" } },
            { $unwind: "$userDetails" },
            {
               $project: {
                  _id: 0,
                  reviewAdded: 0,
                  "technicianDetails._id": 0,
                  "technicianDetails.user_id": 0,
                  "technicianDetails.password": 0,
                  "technicianDetails.isBlocked": 0,
                  "technicianDetails.isTechnician": 0,
                  "technicianDetails.addressDetails": 0,
                  "technicianDetails.alreadychattedtechnician": 0,
                  "technicianDetails.savedTechnicians": 0,
                  "userDetails._id": 0,
                  "userDetails.user_id": 0,
                  "userDetails.password": 0,
                  "userDetails.isBlocked": 0,
                  "userDetails.isTechnician": 0,
                  "userDetails.addressDetails": 0,
                  "userDetails.alreadychattedtechnician": 0,
                  "userDetails.savedTechnicians": 0,
               },
            },
         ]);
      } catch (error) {
         throw error;
      };
   };

};

export default AdminRepository;