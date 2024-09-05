import { Router } from "express";
import { verifyToken } from "../Config/jwt_config";
import TechnicianController from "../Controllers/technicianController";
import TechnicianService from "../Services/technicianService";
import TechnicianRepository from "../Repository/technicianRepository";
import Technician from "../Model/technicianModel";
import Rating from "../Model/reviewModal";
import Booking from "../Model/bookingModel";


const technicianRepository = new TechnicianRepository(Technician, Rating, Booking);
const technicianService = new TechnicianService(technicianRepository);
const technicianController = new TechnicianController(technicianService);

const router = Router();

router.get("/fetchTechnicianInformation", verifyToken, technicianController.fetchTechnicianInformationController.bind(technicianController));
router.patch("/joinTechnician", verifyToken, technicianController.joinNewTechnicianController.bind(technicianController));
router.patch("/changeprofession", verifyToken, technicianController.changeProfessionController.bind(technicianController));
router.patch("/changeAvailabilityStatus", verifyToken, technicianController.changeAvailabilityStatusController.bind(technicianController));
router.get("/fetchTechnicianBookingHistory", verifyToken, technicianController.fetchTechnicianBookingHistoryController.bind(technicianController));
router.get("/fetchingIndividualBookingDetails", verifyToken, technicianController.fetchingIndividualBookingDetailsController.bind(technicianController));
router.patch("/acceptRejectCancelNewBooking", verifyToken, technicianController.acceptRejectCancelNewBookingController.bind(technicianController));
router.post("/confirmBooking", verifyToken, technicianController.completeBookingController.bind(technicianController));
router.patch("/clearNotification", verifyToken, technicianController.clearNotificationController.bind(technicianController));
router.patch("/modifyAvailableSlots", verifyToken, technicianController.modifyAvailableSlotsController.bind(technicianController));
router.get("/wallet", verifyToken, technicianController.fetchWalletInformationController.bind(technicianController));
router.get("/fetchningRatingWithReviewerDetails", verifyToken, technicianController.fetchningRatingWithReviewerDetailsController.bind(technicianController));

export default router;