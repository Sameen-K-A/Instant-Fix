import { Router } from "express";
import { verifyToken } from "../Config/jwt_config";
import TechnicianController from "../Controllers/technicianController";
import TechnicianService from "../Services/technicianService";
import TechnicianRepository from "../Repository/technicianRepository";
import Technician from "../Model/technicianModel";
import Rating from "../Model/reviewModal";
import Booking from "../Model/bookingModel";
import WalletRepository from "../Repository/walletRepository";
import Wallet from "../Model/walletModal";
import UserRepository from "../Repository/userRepository";
import User from "../Model/userModal";


const technicianRepository = new TechnicianRepository(Technician, Rating, Booking);
const walletRepository = new WalletRepository(Wallet);
const userRepository = new UserRepository(User, Booking, Rating)
const technicianService = new TechnicianService(technicianRepository, walletRepository, userRepository);
const technicianController = new TechnicianController(technicianService);

const router = Router();

router.get("/fetchTechnicianInformation", verifyToken, technicianController.getTechnicianInfo);
router.patch("/joinTechnician", verifyToken, technicianController.createTechnician);
router.patch("/changeprofession", verifyToken, technicianController.updateProfession);
router.patch("/changeAvailabilityStatus", verifyToken, technicianController.updateAvailableStatus);
router.get("/fetchTechnicianBookingHistory", verifyToken, technicianController.getBookings);
router.get("/fetchingIndividualBookingDetails", verifyToken, technicianController.getBookingDetails);
router.patch("/acceptRejectCancelNewBooking", verifyToken, technicianController.updateBookingStatus);
router.post("/confirmBooking", verifyToken, technicianController.completeBooking);
router.patch("/clearNotification", verifyToken, technicianController.deleteNotification);
router.patch("/modifyAvailableSlots", verifyToken, technicianController.updateAvailableSlots);
router.get("/wallet", verifyToken, technicianController.getWallet);
router.get("/fetchningRatingWithReviewerDetails", verifyToken, technicianController.getRatingWithReviewerDetails);

export default router;