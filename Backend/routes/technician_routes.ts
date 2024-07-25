import { Router } from "express";
import TechnicianController from "../Controllers/technicianController";

const technicianController = new TechnicianController();
const router = Router();

router.patch("/joinTechnician", technicianController.join_new_Technician)


export default router;