import { Router } from "express";
import UserController from "../Controllers/userController";
import { verifyToken } from "../Config/jwt_config";
import upload from "../Config/Multer_config"

const router = Router();
const userController = new UserController()

router.post("/login", userController.loginController);
router.post("/register", userController.register_controller);
router.post("/verifyotp", userController.verifyOTP_controller);
router.get("/resendOTP", userController.resendOTP_controller);

// user address session;
router.patch("/address", verifyToken, userController.add_EditAddress_controller);
router.delete("/address", verifyToken, userController.deleteAddress_controller);

// user change password
router.patch("/changepassword", verifyToken, userController.changePassword_controller);

// user change personal details
router.patch("/editprofile", verifyToken, upload.single('profile'), userController.editprofile_controller);

// fetching saved technician information 
router.get("/fetchSavedTechnicianDetails", verifyToken, userController.fetchSavedTechnicianDetailsController);

//fetching technicians details
router.get("/fetchTechnician", verifyToken, userController.fetchTechnician_controller);
router.get("/fetchTechnicianIndividualInformation", verifyToken, userController.fetchTechnicianIndividualInformationController)

// chatting area
router.get("/fetchAlreadyChattedTechnicians", verifyToken, userController.fetchAlreadyChattedTechnicians_controller);

// booking new technician area
router.post("/bookTechnician", verifyToken, userController.bookTechnician_controller);

// booking history and its related details
router.get("/fetchUserBookingHistory", verifyToken, userController.fetchUserBookingHistory_controller);
router.get("/fetchIndividualBookingInformation", verifyToken, userController.fetchIndividualBookingInformation_controller);
router.patch("/cancelBooking", verifyToken, userController.cancelBooking_controller);

export default router;