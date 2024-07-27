import { Router } from "express";
import AdminController from "../Controllers/adminController";

const router = Router();
const adminController = new AdminController();

router.post("/login", adminController.loginController);
router.get("/fetchUser", adminController.fetchUserController);
router.patch("/unblockUser", adminController.unblockUserController);
router.patch("/blockUser", adminController.blockUserController);

export default router;