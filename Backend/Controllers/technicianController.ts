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

}

export default TechnicianController;