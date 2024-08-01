import { Router } from "express";
import TechnicianController from "../Controllers/technicianController";
import { verifyToken } from "../Config/jwt_config"

const technicianController = new TechnicianController();
const router = Router();

router.patch("/joinTechnician", verifyToken, technicianController.joinNewTechnicianController);
router.patch("/changeprofession", verifyToken, technicianController.changeProfessionController);


export default router;