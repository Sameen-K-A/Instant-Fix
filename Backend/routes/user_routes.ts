import { Router } from "express";
import UserController from "../Controllers/userController";

const router = Router();
const userController = new UserController()

router.post("/login", userController.loginController);
router.post("/register", userController.register_controller);
router.post("/verifyotp", userController.verifyOTP_controller);
router.post("/resendOTP", userController.resendOTP_controller);

// user address session;
router.get("/address", userController.fetchAddress_controller);
router.post("/address", userController.addAddress_controller);
router.delete("/address", userController.deleteAddress_controller);

export default router;