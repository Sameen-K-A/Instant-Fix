"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const bookingConfirmEmail_1 = __importDefault(require("../Config/bookingConfirmEmail"));
const s3_config_1 = require("../Config/s3_config");
class TechnicianService {
    constructor(technicianRepository, walletRepository, userRepository) {
        this.createTechnician = async (user_id, profession) => {
            try {
                const technicianData = {
                    user_id: user_id,
                    rating: 0,
                    technician_id: (0, uuid_1.v4)(),
                    profession: profession,
                };
                const response = await this.userRepository.accessIsTechnician(user_id);
                if (!response) {
                    throw new Error("Failed to update user to technician");
                }
                ;
                const technicianWallet = {
                    user_id: user_id,
                    balanceAmount: 0,
                    transactions: [],
                };
                const ratingDetails = {
                    user_id: user_id,
                    reviews: [],
                };
                const [technicianResponse, walletResponse] = await Promise.all([
                    this.technicianRepository.createTechnician(technicianData),
                    this.walletRepository.createWallet(technicianWallet),
                    this.technicianRepository.createRating(ratingDetails),
                ]);
                if (!technicianResponse || !walletResponse) {
                    throw new Error("Failed to create technician.");
                }
                ;
                return technicianResponse;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.updateProfession = async (user_id, profession) => {
            try {
                return await this.technicianRepository.updateProfession(user_id, profession);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.updateAvailableStatus = async (user_id, newStatus) => {
            try {
                newStatus = newStatus === "Active" ? true : false;
                return await this.technicianRepository.updateAvailableStatus(user_id, newStatus);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.getTechnicianInfo = async (userId) => {
            try {
                return await this.technicianRepository.getTechnicianInfo(userId);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.getBookings = async (technicianUserID) => {
            try {
                return await this.technicianRepository.getBookings(technicianUserID);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.getBookingDetails = async (bookingId) => {
            try {
                return await this.technicianRepository.getBookingDetails(bookingId);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.deleteNotification = async (userId) => {
            try {
                return await this.technicianRepository.deleteNotification(userId);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.updateBookingStatus = async (bookingId, newStatus, technicianId, serviceDate) => {
            try {
                const status = newStatus === "Accept" ? "Pending" : (newStatus === "Reject" ? "Rejected" : "Cancelled");
                await this.technicianRepository.updateBookingStatus(bookingId, status);
                if (status === "Rejected" || status === "Cancelled") {
                    await this.technicianRepository.cancelBookingSlot(technicianId, serviceDate);
                }
                ;
                return true;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.completeBooking = async (bookingId, clientId, laborCharge) => {
            try {
                const clientDetails = await this.userRepository.findByUser_id(clientId);
                if (!clientDetails) {
                    throw new Error("Client details not found.");
                }
                ;
                const completedDate = new Date().toLocaleDateString('en-CA');
                const [emailResponse] = await Promise.all([
                    (0, bookingConfirmEmail_1.default)(clientDetails.email, laborCharge, bookingId),
                    this.technicianRepository.completeBooking(bookingId, laborCharge, completedDate),
                ]);
                if (!emailResponse) {
                    throw new Error("Failed to complete booking.");
                }
                ;
                return true;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.updateAvailableSlots = async (technicianId, slots) => {
            try {
                return await this.technicianRepository.updateAvailableSlots(technicianId, slots);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.getWallet = async (user_id) => {
            try {
                return this.walletRepository.getWallet(user_id);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.getRatingWithReviewerDetails = async (userId) => {
            try {
                const result = await this.technicianRepository.getRatingWithReviewerDetails(userId);
                result.reviews = await Promise.all(result.reviews.map(async (review) => {
                    const reviewer = result.reviewerDetails?.find(reviewer => reviewer.user_id === review.rated_user_id);
                    const reviewerProfileIMG = reviewer?.profileIMG ? await (0, s3_config_1.generateGetPreSignedURL)(reviewer.profileIMG) : "";
                    return { ...review, reviewerName: reviewer?.name, reviewerProfileIMG };
                }));
                delete result.reviewerDetails;
                return result;
            }
            catch (error) {
                throw error;
            }
        };
        this.technicianRepository = technicianRepository;
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
    }
}
;
exports.default = TechnicianService;
