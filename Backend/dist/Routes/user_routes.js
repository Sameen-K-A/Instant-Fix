"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_config_1 = require("../Config/jwt_config");
const userController_1 = __importDefault(require("../Controllers/userController"));
const userServices_1 = __importDefault(require("../Services/userServices"));
const userRepository_1 = __importDefault(require("../Repository/userRepository"));
const technicianRepository_1 = __importDefault(require("../Repository/technicianRepository"));
const walletRepository_1 = __importDefault(require("../Repository/walletRepository"));
const userModal_1 = __importDefault(require("../Model/userModal"));
const bookingModel_1 = __importDefault(require("../Model/bookingModel"));
const reviewModal_1 = __importDefault(require("../Model/reviewModal"));
const technicianModel_1 = __importDefault(require("../Model/technicianModel"));
const walletModal_1 = __importDefault(require("../Model/walletModal"));
const userAuth_1 = __importDefault(require("../Middleware/userAuth"));
const userRepository = new userRepository_1.default(userModal_1.default, bookingModel_1.default, reviewModal_1.default);
const technicianRepository = new technicianRepository_1.default(technicianModel_1.default, reviewModal_1.default, bookingModel_1.default);
const walletRepository = new walletRepository_1.default(walletModal_1.default);
const userService = new userServices_1.default(userRepository, technicianRepository, walletRepository);
const userController = new userController_1.default(userService);
const router = (0, express_1.Router)();
router.post("/google/auth", userController.verifyGoogleAuth);
router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/verifyotp", userController.otpVerification);
router.get("/resendOTP", userController.resendOTP);
// user address session;
router.patch("/address", jwt_config_1.verifyToken, userAuth_1.default, userController.createUpdateAddress);
router.delete("/address", jwt_config_1.verifyToken, userAuth_1.default, userController.deleteAddress);
// user change password
router.patch("/changepassword", jwt_config_1.verifyToken, userAuth_1.default, userController.updatePassword);
// user change personal details
router.patch("/editprofile", jwt_config_1.verifyToken, userAuth_1.default, userController.updateProfileDetails);
router.patch("/updateProfileImage", jwt_config_1.verifyToken, userAuth_1.default, userController.updateProfileImage);
router.get("/getPreSignedURL", jwt_config_1.verifyToken, userAuth_1.default, userController.getPreSignedURL);
// fetching saved technician information 
router.patch("/saveTechnician", jwt_config_1.verifyToken, userAuth_1.default, userController.followTechnician);
router.patch("/unSaveTechnician", jwt_config_1.verifyToken, userAuth_1.default, userController.unfollowTechnician);
router.get("/fetchSavedTechnicianDetails", jwt_config_1.verifyToken, userAuth_1.default, userController.getFollowedTechnicians);
//fetching technicians details
router.get("/fetchTechnician", jwt_config_1.verifyToken, userAuth_1.default, userController.getTechnicians);
router.get("/fetchTechnicianIndividualInformation", jwt_config_1.verifyToken, userAuth_1.default, userController.getTechnicianWithPersonalDetails);
// chatting area
router.get("/fetchAlreadyChattedTechnicians", jwt_config_1.verifyToken, userAuth_1.default, userController.getChatFriends);
// booking new technician area
router.post("/bookTechnician", jwt_config_1.verifyToken, userAuth_1.default, userController.bookTechnician);
// booking history and its related details
router.get("/fetchUserBookingHistory", jwt_config_1.verifyToken, userAuth_1.default, userController.getBookingsHistory);
router.get("/fetchIndividualBookingInformation", jwt_config_1.verifyToken, userAuth_1.default, userController.getBookingDetails);
router.patch("/cancelBooking", jwt_config_1.verifyToken, userAuth_1.default, userController.cancelBooking);
// payment side
router.post("/proceedToPayment", jwt_config_1.verifyToken, userAuth_1.default, userController.proceedToPayment);
router.post("/verifyPayment", jwt_config_1.verifyToken, userAuth_1.default, userController.verifyPayment);
//  technician feedback side
router.post("/submitReview", jwt_config_1.verifyToken, userAuth_1.default, userController.submitReview);
// logout
router.get("/logout", userController.logout);
exports.default = router;
