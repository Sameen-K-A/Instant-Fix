import { Router } from "express";
import AdminController from "../Controllers/adminController";
import { adminVerifyToken } from "../Config/jwt_config";
import AdminServices from "../Services/adminServices";
import AdminRepository from "../Repository/adminRepository";
import User from "../Model/userModal";
import Booking from "../Model/bookingModel";
import Technician from "../Model/technicianModel";

const router = Router();

const adminRepository = new AdminRepository(User, Booking, Technician);
const adminService = new AdminServices(adminRepository);
const adminController = new AdminController(adminService);

router.post("/login", adminController.login);
router.get("/fetchUser", adminVerifyToken, adminController.findUser);
router.patch("/unblockUser", adminVerifyToken, adminController.unBlock);
router.patch("/blockUser", adminVerifyToken, adminController.block);
router.get("/fetchTechnicians", adminVerifyToken, adminController.findTechnician);
router.get("/fetchBookings", adminVerifyToken, adminController.findBooking);
router.get("/fetchbookingsLocation", adminVerifyToken, adminController.fetchbookingsLocation);
router.get("/getCategories", adminVerifyToken, adminController.getCategories);
router.get("/logout", adminController.logout);

export default router;