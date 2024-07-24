import { Request, Response } from "express";
import AdminServices from "../Services/adminServices";
const adminServices = new AdminServices();

class AdminController {

   async loginController(req: Request, res: Response) {
      const { email, password } = req.body;
      const serviceResponse = await adminServices.loginService(email, password);
      res.send(serviceResponse);
   };

}

export default AdminController;