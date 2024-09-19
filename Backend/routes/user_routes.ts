import { Router } from "express";
import { verifyToken } from "../Config/jwt_config";
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
import isBloked from "../Middleware/userAuth";

const userRepository = new UserRepository(User, Booking, Rating);
const technicianRepository = new TechnicianRepository(Technician, Rating, Booking);
const walletRepository = new WalletRepository(Wallet);
const userService = new UserServices(userRepository, technicianRepository, walletRepository);
const userController = new UserController(userService);

const router = Router();

router.post("/google/auth", userController.verifyGoogleAuth);
router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/verifyotp", userController.otpVerification);
router.get("/resendOTP", userController.resendOTP);

// user address session;
router.patch("/address", verifyToken, isBloked, userController.createUpdateAddress);
router.delete("/address", verifyToken, isBloked, userController.deleteAddress);

// user change password
router.patch("/changepassword", verifyToken, isBloked, userController.updatePassword);

// user change personal details
router.patch("/editprofile", verifyToken, isBloked, userController.updateProfileDetails);
router.patch("/updateProfileImage", verifyToken, isBloked, userController.updateProfileImage);
router.get("/getPreSignedURL", verifyToken, isBloked, userController.getPreSignedURL);

// fetching saved technician information 
router.patch("/saveTechnician", verifyToken, isBloked, userController.followTechnician);
router.patch("/unSaveTechnician", verifyToken, isBloked, userController.unfollowTechnician);
router.get("/fetchSavedTechnicianDetails", verifyToken, isBloked, userController.getFollowedTechnicians);

//fetching technicians details
router.get("/fetchTechnician", verifyToken, isBloked, userController.getTechnicians);
router.get("/fetchTechnicianIndividualInformation", verifyToken, isBloked, userController.getTechnicianWithPersonalDetails);

// chatting area
router.get("/fetchAlreadyChattedTechnicians", verifyToken, isBloked, userController.getChatFriends);

// booking new technician area
router.post("/bookTechnician", verifyToken, isBloked, userController.bookTechnician);

// booking history and its related details
router.get("/fetchUserBookingHistory", verifyToken, isBloked, userController.getBookingsHistory);
router.get("/fetchIndividualBookingInformation", verifyToken, isBloked, userController.getBookingDetails);
router.patch("/cancelBooking", verifyToken, isBloked, userController.cancelBooking);

// payment side
router.post("/proceedToPayment", verifyToken, isBloked, userController.proceedToPayment);
router.post("/verifyPayment", verifyToken, isBloked, userController.verifyPayment);

//  technician feedback side
router.post("/submitReview", verifyToken, isBloked, userController.submitReview);

// logout
router.get("/logout", userController.logout)

export default router;