import { Request, Response } from "express";
import TechnicianService from "../Services/technicianService";

const technicianService = new TechnicianService();

class TechnicianController {

   async joinNewTechnicianController(req: Request, res: Response): Promise<void> {
      try {
         const user_id: string = req.query.user_id as string;
         const profession: string = req.query.profession as string;
         const serviceResult = await technicianService.joinNewTechnicianService(user_id, profession);
         if (serviceResult) {
            res.status(200).json({ message: 'Technician joined successfully', serviceResult });
         } else {
            res.status(500).json({ message: 'Failed to join technician' });
         }
      } catch (error) {
         console.log(error);
         res.status(500).json({ message: 'Internal Server Error' });
      }
   };

}

export default TechnicianController;