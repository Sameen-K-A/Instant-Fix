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
import isBloked from "../Middleware/userAuth";


const technicianRepository = new TechnicianRepository(Technician, Rating, Booking);
const walletRepository = new WalletRepository(Wallet);
const userRepository = new UserRepository(User, Booking, Rating)
const technicianService = new TechnicianService(technicianRepository, walletRepository, userRepository);
const technicianController = new TechnicianController(technicianService);

const router = Router();

router.get("/fetchTechnicianInformation", verifyToken, isBloked, technicianController.getTechnicianInfo);
router.patch("/joinTechnician", verifyToken, isBloked, technicianController.createTechnician);
router.patch("/changeprofession", verifyToken, isBloked, technicianController.updateProfession);
router.patch("/changeAvailabilityStatus", verifyToken, isBloked, technicianController.updateAvailableStatus);
router.get("/fetchTechnicianBookingHistory", verifyToken, isBloked, technicianController.getBookings);
router.get("/fetchingIndividualBookingDetails", verifyToken, isBloked, technicianController.getBookingDetails);
router.patch("/acceptRejectCancelNewBooking", verifyToken, isBloked, technicianController.updateBookingStatus);
router.post("/confirmBooking", verifyToken, isBloked, technicianController.completeBooking);
router.patch("/clearNotification", verifyToken, isBloked, technicianController.deleteNotification);
router.patch("/modifyAvailableSlots", verifyToken, isBloked, technicianController.updateAvailableSlots);
router.get("/wallet", verifyToken, isBloked, technicianController.getWallet);
router.get("/fetchningRatingWithReviewerDetails", verifyToken, isBloked, technicianController.getRatingWithReviewerDetails);

export default router;