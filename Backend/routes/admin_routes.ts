import { Router } from "express";
import AdminController from "../Controllers/adminController";
import { verifyToken } from "../Config/jwt_config";
import AdminServices from "../Services/adminServices";
import AdminRepository from "../Repository/adminRepository";
import User from "../Model/userModal";
import Booking from "../Model/bookingModel";

const router = Router();

const adminRepository = new AdminRepository(User, Booking);
const adminService = new AdminServices(adminRepository);
const adminController = new AdminController(adminService);

router.post("/login", adminController.login.bind(adminController));
router.get("/fetchUser", verifyToken, adminController.findUser.bind(adminController));
router.patch("/unblockUser", verifyToken, adminController.unBlock.bind(adminController));
router.patch("/blockUser", verifyToken, adminController.block.bind(adminController));
router.get("/fetchTechnicians", verifyToken, adminController.findTechnician.bind(adminController));
router.get("/fetchBookings", verifyToken, adminController.findBooking.bind(adminController));

export default router;