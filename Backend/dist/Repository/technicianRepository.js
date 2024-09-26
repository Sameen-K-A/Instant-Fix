"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicianRepository = void 0;
class TechnicianRepository {
    constructor(technicianModel, ratingModel, bookingModel) {
        this.createTechnician = async (technicianData) => {
            try {
                return await this.technicianModel.create(technicianData);
            }
            catch (error) {
                console.error('Error creating technician:', error);
                throw error;
            }
            ;
        };
        this.updateProfession = async (user_id, profession) => {
            try {
                const updateResult = await this.technicianModel.updateOne({ user_id: user_id }, { $set: { profession: profession } });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("No changes found");
                }
                ;
            }
            catch (error) {
                console.error('Error changing profession:', error);
                throw error;
            }
            ;
        };
        this.updateAvailableStatus = async (user_id, newStatus) => {
            try {
                const updateResult = await this.technicianModel.updateOne({ user_id: user_id }, { $set: { availability: newStatus } });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("Failed to change status");
                }
                ;
            }
            catch (error) {
                console.error('Error changing availability status:', error);
                throw error;
            }
            ;
        };
        this.getBookings = async (technicianUserID) => {
            try {
                return await this.bookingModel.aggregate([
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
                            payment_status: 0,
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
                        },
                    },
                ]);
            }
            catch (error) {
                console.error('Error fetching technician booking history:', error);
                throw error;
            }
            ;
        };
        this.getTechnicianInfo = async (technicianUser_id) => {
            try {
                return await this.technicianModel.findOne({ user_id: technicianUser_id }, { _id: 0 });
            }
            catch (error) {
                console.error('Error fetching technician information:', error);
                throw error;
            }
            ;
        };
        this.getBookingDetails = async (booking_id) => {
            try {
                const response = await this.bookingModel.aggregate([
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
            }
            catch (error) {
                console.error('Error fetching individual booking details:', error);
                throw error;
            }
            ;
        };
        this.updateBookingStatus = async (booking_id, status) => {
            try {
                const updateResult = await this.bookingModel.updateOne({ booking_id: booking_id }, { $set: { booking_status: status } });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("Failed to change booking status.");
                }
            }
            catch (error) {
                console.error('Error updating booking status:', error);
                throw error;
            }
            ;
        };
        this.updateAvailableSlots = async (technician_id, availableSlots) => {
            try {
                const updateResult = await this.technicianModel.updateOne({ user_id: technician_id }, { $set: { availableSlots: availableSlots } });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("Failed to update available slots.");
                }
            }
            catch (error) {
                console.error('Error modifying available slots:', error);
                throw error;
            }
            ;
        };
        this.completeBooking = async (booking_id, laborCharge, completeDate) => {
            try {
                const updateResult = await this.bookingModel.updateOne({ booking_id: booking_id }, {
                    $set: {
                        booking_status: "Completed",
                        serviceCost: laborCharge,
                        serviceCompletedDate: completeDate,
                        payment_status: "Requested"
                    }
                });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("Failed to complete booking.");
                }
                ;
            }
            catch (error) {
                console.error('Error completing booking:', error);
                throw error;
            }
            ;
        };
        this.deleteNotification = async (technicianUser_id) => {
            try {
                const updateResult = await this.technicianModel.updateOne({ user_id: technicianUser_id }, { $set: { notifications: [] } });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("Failed to clear notifications");
                }
                ;
            }
            catch (error) {
                console.error('Error clearing notifications:', error);
                throw error;
            }
            ;
        };
        this.bookSlot = async (technicianUser_id, selectedDate) => {
            try {
                const updateResult = await this.technicianModel.updateOne({ user_id: technicianUser_id, "availableSlots.slotDate": selectedDate }, { $set: { "availableSlots.$.slotBooked": true } });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("Booking failed");
                }
                ;
            }
            catch (error) {
                console.error('Error changing technician slot after booking:', error);
                throw error;
            }
            ;
        };
        this.cancelBookingSlot = async (technicianUser_id, selectedDate) => {
            try {
                const updateResult = await this.technicianModel.updateOne({ user_id: technicianUser_id, "availableSlots.slotDate": selectedDate }, { $set: { "availableSlots.$.slotBooked": false } });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("Failed to cancel booking slot");
                }
                ;
            }
            catch (error) {
                console.error('Error changing technician slot after booking cancellation:', error);
                throw error;
            }
            ;
        };
        this.addNotification = async (technicianUser_id, notification) => {
            try {
                const updateResult = await this.technicianModel.updateOne({ user_id: technicianUser_id }, { $push: { notifications: notification } });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("failed to send notification");
                }
                ;
            }
            catch (error) {
                console.error('Error adding new notification:', error);
                throw error;
            }
            ;
        };
        this.createRating = async (ratingDetails) => {
            try {
                return await this.ratingModel.create(ratingDetails);
            }
            catch (error) {
                console.error('Error creating rating details:', error);
                throw error;
            }
        };
        this.getTechnicianFeedbacks = async (technician_id) => {
            try {
                return await this.ratingModel.findOne({ user_id: technician_id }, { _id: 0 });
            }
            catch (error) {
                console.error('Error fetching all feedbacks:', error);
                throw error;
            }
        };
        this.updateTechnicianRating = async (technician_id, newRating) => {
            try {
                const updateResult = await this.technicianModel.updateOne({ user_id: technician_id }, { rating: newRating });
                if (updateResult.modifiedCount === 1) {
                    return true;
                }
                else {
                    throw new Error("Something wrong please try again later");
                }
                ;
            }
            catch (error) {
                console.error('Error updating new average rating to technician:', error);
                throw error;
            }
            ;
        };
        this.getRatingWithReviewerDetails = async (technicianUser_id) => {
            try {
                const res = await this.ratingModel.aggregate([
                    { $match: { user_id: technicianUser_id } },
                    { $lookup: { from: "users", localField: "reviews.rated_user_id", foreignField: "user_id", as: "reviewerDetails" } },
                    { $lookup: { from: "technicians", localField: "user_id", foreignField: "user_id", as: "technicianRating" } },
                    { $unwind: "$technicianRating" },
                    {
                        $project: {
                            _id: 0,
                            user_id: 0,
                            "reviewerDetails._id": 0,
                            "reviewerDetails.isTechnician": 0,
                            "reviewerDetails.email": 0,
                            "reviewerDetails.phone": 0,
                            "reviewerDetails.addressDetails": 0,
                            "reviewerDetails.savedTechnicians": 0,
                            "reviewerDetails.alreadychattedtechnician": 0,
                            "reviewerDetails.password": 0,
                            "reviewerDetails.isBlocked": 0,
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
            }
            catch (error) {
                console.error('Error fetching rating with reviewer details:', error);
                throw error;
            }
            ;
        };
        this.technicianModel = technicianModel;
        this.ratingModel = ratingModel;
        this.bookingModel = bookingModel;
    }
    ;
}
exports.TechnicianRepository = TechnicianRepository;
;
exports.default = TechnicianRepository;
