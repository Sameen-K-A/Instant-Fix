import { Router } from "express";
import UserController from "../Controllers/userController";
import { verifyToken } from "../Config/jwt_config";

const router = Router();
const userController = new UserController()

router.post("/login", userController.loginController);
router.post("/register", userController.register_controller);
router.post("/verifyotp", userController.verifyOTP_controller);
router.get("/resendOTP", userController.resendOTP_controller);

// user address session;
router.get("/address", verifyToken, userController.fetchAddress_controller);
router.post("/address", verifyToken, userController.addAddress_controller);
router.delete("/address", verifyToken, userController.deleteAddress_controller);

// user change password
router.patch("/changepassword", verifyToken, userController.changePassword_controller);

export default router;