import { Router } from "express";
import UserController from "../Controllers/userController";

const router = Router();
const userController = new UserController()

router.post("/login", userController.login_controller);
router.post("/register", userController.register_controller);
router.post("/verifyotp", userController.verifyOTP_controller);

export default router;