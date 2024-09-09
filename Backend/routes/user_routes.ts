import { Router } from "express";
import { verifyToken } from "../Config/jwt_config";
import upload from "../Config/Multer_config"
import UserController from "../Controllers/userController";
import UserServices from "../Services/userServices";
import UserRepository from "../Repository/userRepository";
import TechnicianRepository from "../Repository/technicianRepository";
import WalletRepository from "../Repository/walletRepository";
import User from "../Model/userModal";
import Booking from "../Model/bookingModel";
import Rating from "../Model/reviewModal";
import Technician from "../Model/technicianModel";
import Wallet from "../Model/walletModal";


const userRepository = new UserRepository(User, Booking, Rating);
const technicianRepository = new TechnicianRepository(Technician, Rating, Booking);
const walletRepository = new WalletRepository(Wallet);
const userService = new UserServices(userRepository, technicianRepository, walletRepository);
const userController = new UserController(userService);

const router = Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/verifyotp", userController.otpVerification);
router.get("/resendOTP", userController.resendOTP);

// user address session;
router.patch("/address", verifyToken, userController.createUpdateAddress);
router.delete("/address", verifyToken, userController.deleteAddress);

// user change password
router.patch("/changepassword", verifyToken, userController.updatePassword);

// user change personal details
router.patch("/editprofile", verifyToken, upload.single('profile'), userController.updateProfile);

// fetching saved technician information 
router.patch("/saveTechnician", verifyToken, userController.followTechnician);
router.patch("/unSaveTechnician", verifyToken, userController.unfollowTechnician);
router.get("/fetchSavedTechnicianDetails", verifyToken, userController.getFollowedTechnicians);

//fetching technicians details
router.get("/fetchTechnician", verifyToken, userController.getTechnicians);
router.get("/fetchTechnicianIndividualInformation", verifyToken, userController.getTechnicianWithPersonalDetails);

// chatting area
router.get("/fetchAlreadyChattedTechnicians", verifyToken, userController.getChatFriends);

// booking new technician area
router.post("/bookTechnician", verifyToken, userController.bookTechnician);

// booking history and its related details
router.get("/fetchUserBookingHistory", verifyToken, userController.getBookingsHistory);
router.get("/fetchIndividualBookingInformation", verifyToken, userController.getBookingDetails);
router.patch("/cancelBooking", verifyToken, userController.cancelBooking);

// payment side
router.post("/proceedToPayment", verifyToken, userController.proceedToPayment);
router.post("/verifyPayment", verifyToken, userController.verifyPayment);

//  technician feedback side
router.post("/submitReview", verifyToken, userController.submitReview);

// logout
router.get("/logout", userController.logout)

export default router;