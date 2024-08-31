import { Router } from "express";
import TechnicianController from "../Controllers/technicianController";
import { verifyToken } from "../Config/jwt_config"

const technicianController = new TechnicianController();
const router = Router();

// fetching technician information from db
router.get("/fetchTechnicianInformation", verifyToken, technicianController.fetchTechnicianInformationController)

// rout for user can join as a technician;
router.patch("/joinTechnician", verifyToken, technicianController.joinNewTechnicianController);

// technician profession changing
router.patch("/changeprofession", verifyToken, technicianController.changeProfessionController);

// changing available status is true or false
router.patch("/changeAvailabilityStatus", verifyToken, technicianController.changeAvailabilityStatusController);

// Booking side (Fetching all, individual, accept, reject)
router.get("/fetchTechnicianBookingHistory", verifyToken, technicianController.fetchTechnicianBookingHistoryController);
router.get("/fetchingIndividualBookingDetails", verifyToken, technicianController.fetchingIndividualBookingDetailsController);
router.patch("/acceptRejectCancelNewBooking", verifyToken, technicianController.acceptRejectCancelNewBookingController);
router.post("/confirmBooking", verifyToken, technicianController.completeBookingController);

// notification area
router.patch("/clearNotification", verifyToken, technicianController.clearNotificationController)

// changing technician available slots
router.patch("/modifyAvailableSlots", verifyToken, technicianController.modifyAvailableSlotsController);

// wallet information
router.get("/wallet", verifyToken, technicianController.fetchWalletInformationController);

export default router;