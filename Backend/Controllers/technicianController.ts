import { Request, Response } from "express";


class TechnicianController {

   async join_new_Technician(req: Request, res: Response) {
      const user_id: string = req.query.user_id as string;
      const profession: string = req.query.profession as string;
      console.log(user_id, profession);
   };

}

export default TechnicianController;