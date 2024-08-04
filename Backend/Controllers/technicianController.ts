import { Request, Response } from "express";
import TechnicianService from "../Services/technicianService";

const technicianService = new TechnicianService();

class TechnicianController {

  async joinNewTechnicianController(req: Request, res: Response): Promise<void> {
    try {
      const user_id: string = req.query.user_id as string;
      const profession: string = req.query.profession as string;
      const serviceResult = await technicianService.joinNewTechnicianService(user_id, profession);
      res.status(200).json(serviceResult);
    } catch (error) {
      console.log("error from controll ", error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  async changeProfessionController(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, profession } = req.body;
      await technicianService.changeProfessionService(user_id, profession);
      res.status(200).send("Changes commit successfully");
    } catch (error: any) {
      if (error.message === "No changes found") {
        res.status(304).json({ message: "No changes found" });
      } else {
        res.status(500).json(error);
      }
    }
  };

  async changeAvailabilityStatusController(req: Request, res: Response) {
    try {
      const { user_id, newStatus } = req.body;
      await technicianService.changeAvailabilityStatusService(user_id, newStatus);
      res.status(200).send("Changes completed successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  }

}

export default TechnicianController;