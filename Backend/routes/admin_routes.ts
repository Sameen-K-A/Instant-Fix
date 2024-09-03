import { Router } from "express";
import AdminController from "../Controllers/adminController";
import { verifyToken } from "../Config/jwt_config";

const router = Router();
const adminController = new AdminController();

router.post("/login", adminController.loginController);
router.get("/fetchUser", verifyToken, adminController.fetchUserController);
router.patch("/unblockUser", verifyToken, adminController.unblockUserController);
router.patch("/blockUser", verifyToken, adminController.blockUserController);
router.get("/fetchTechnicians", verifyToken, adminController.fetchTechniciansController);
router.get("/fetchbookings", verifyToken, adminController.fetchBookingsController);

export default router;