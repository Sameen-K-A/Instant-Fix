import { Model } from "mongoose";
import { IAdminRepository } from "../Interfaces/admin.repository.interface";
import { IBookingDetails, IBookingHistory, ITechnicians, IUser } from "../Interfaces/common.interface";

class AdminRepository implements IAdminRepository {
   private userModel: Model<IUser>;
   private bookingModel: Model<IBookingDetails>;

   constructor(userModel: Model<IUser>, bookingModel: Model<IBookingDetails>) {
      this.userModel = userModel;
      this.bookingModel = bookingModel;
   };

   findUser = async (): Promise<IUser[]> => {
      try {
         return await this.userModel.aggregate([
            { $match: {} },
            { $sort: { _id: -1 } },
            { $project: { _id: 0, password: 0, profileIMG: 0, isTechnician: 0, addressDetails: 0, alreadychattedtechnician: 0, savedTechnicians: 0 } },
         ]);
      } catch (error) {
         throw error;
      };
   };

   unBlock = async (user_id: string): Promise<boolean> => {
      try {
         const updateResult = await this.userModel.updateOne({ user_id }, { isBlocked: false });
         if (updateResult.modifiedCount === 1) {
            return true;
         } else {
            throw new Error("Failed to block unblock user");
         };
      } catch (error) {
         throw error;
      };
   };

   block = async (user_id: string): Promise<boolean> => {
      try {
         const updateResult = await this.userModel.updateOne({ user_id }, { isBlocked: true });
         if (updateResult.modifiedCount === 1) {
            return true;
         } else {
            throw new Error("Failed to block block user");
         };
      } catch (error) {
         throw error;
      };
   };

   findTechnician = async (): Promise<ITechnicians[]> => {
      try {
         return await this.userModel.aggregate([
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
         throw error;
      };
   };

   findBooking = async (): Promise<IBookingHistory[]> => {
      try {
         return await this.bookingModel.aggregate([
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