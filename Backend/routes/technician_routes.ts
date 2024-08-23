import { Router } from "express";
import TechnicianController from "../Controllers/technicianController";
import { verifyToken } from "../Config/jwt_config"

const technicianController = new TechnicianController();
const router = Router();

router.patch("/joinTechnician", verifyToken, technicianController.joinNewTechnicianController);
router.patch("/changeprofession", verifyToken, technicianController.changeProfessionController);
router.patch("/changeAvailabilityStatus", verifyToken, technicianController.changeAvailabilityStatusController);
router.get("/fetchTechnicianBookingHistory", verifyToken, technicianController.fetchTechnicianBookingHistoryController);

router.get("/fetchingIndividualBookingDetails", verifyToken, technicianController.fetchingIndividualBookingDetailsController);
router.patch("/acceptRejectCancelNewBooking", verifyToken, technicianController.acceptRejectCancelNewBookingController);

router.patch("/modifyAvailableSlots", verifyToken, technicianController.modifyAvailableSlotsController);

export default router;