"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminRepository {
    constructor(userModel, bookingModel, technicianModel) {
        this.findUser = async () => {
            try {
                return await this.userModel.aggregate([
                    { $match: {} },
                    { $sort: { _id: -1 } },
                    { $project: { _id: 0, password: 0, profileIMG: 0, addressDetails: 0, alreadychattedtechnician: 0, savedTechnicians: 0 } },
                ]);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.unBlock = async (user_id) => {
            try {
                const updateResult = await this.userModel.updateOne({ user_id }, { isBlocked: false });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("Failed to block unblock user");
                }
                ;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.block = async (user_id) => {
            try {
                const updateResult = await this.userModel.updateOne({ user_id }, { isBlocked: true });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("Failed to block block user");
                }
                ;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.findTechnician = async () => {
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
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.findBooking = async () => {
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
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.getCategories = async () => {
            try {
                const res = await this.technicianModel.aggregate([
                    { $group: { _id: "$profession", count: { $sum: 1 } } },
                    { $project: { _id: 0, profession: "$_id", count: 1 } },
                ]);
                return res;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.filteredBooking = async (selectedDates) => {
            try {
                const response = await this.bookingModel.aggregate([
                    { $match: { bookingDate: { $in: selectedDates } } },
                    {
                        $group: {
                            _id: "$bookingDate",
                            totalBookings: { $sum: 1 },
                            bookings: {
                                $push: {
                                    booking_status: "$booking_status",
                                    booking_profession: "$booking_profession",
                                    serviceCompletedDate: "$serviceCompletedDate",
                                },
                            },
                        },
                    },
                    { $project: { _id: 0, bookingDate: "$_id", totalBookings: 1, bookings: 1, }, },
                ]);
                return response;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.fetchbookingsLocation = async () => {
            try {
                let result = await this.bookingModel.aggregate([
                    { $match: {} },
                    { $project: { _id: 0, location: "$serviceLocation.location" } },
                ]);
                result = result.map((item) => item.location);
                return result;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.userModel = userModel;
        this.bookingModel = bookingModel;
        this.technicianModel = technicianModel;
    }
    ;
}
;
exports.default = AdminRepository;
