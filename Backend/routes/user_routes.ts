import { Router } from "express";
import UserController from "../Controllers/userController";

const router = Router();
const userController = new UserController()

router.post("/register", userController.register_controller);

export default router;