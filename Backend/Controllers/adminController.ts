import { Request, Response } from "express";
import AdminServices from "../Services/adminServices";
const adminServices = new AdminServices();

class AdminController {

   async loginController(req: Request, res: Response) {
      try {
         const { email, password } = req.body;
         const serviceResponse = await adminServices.loginService(email, password);
         res.status(200).send(serviceResponse);
      } catch (error: any) {
         if (error.message === "Wrong email") {
            res.status(404).json({ message: "Email not found" })
         } else if (error.message === "Wrong password") {
            res.status(401).json({ message: "Password is wrong" });
         } else {
            res.status(500).json(error);
         }
      }
   };

   async fetchUserController(req: Request, res: Response) {
      try {
         const serviceResponse = await adminServices.fetchUserService();
         res.status(200).json(serviceResponse);
      } catch (error) {
         res.status(500).json("Something wrong please try again later");
      }
   }

   async unblockUserController(req: Request, res: Response) {
      try {
         const user_id = req.query.user_id as string;
         const serviceResponse = await adminServices.unblockUserService(user_id);
         res.status(200).json(serviceResponse);
      } catch (error: any) {
         res.status(500).json("Something went wrong, please try again later");
      }
   }

   async blockUserController(req: Request, res: Response) {
      try {
         const user_id = req.query.user_id as string;
         const serviceResponse = await adminServices.blockUserService(user_id);
         res.status(200).json(serviceResponse);
      } catch (error: any) {
         res.status(500).json("Something went wrong, please try again later");
      }
   }

   async fetchTechnicians(req: Request, res: Response) {
      try {
         const controllResponse = await adminServices.fetchTechnicianService();
         res.status(200).json(controllResponse);
      } catch (error) {
         res.status(500).send("Something wrong please try again later");
      }
   }

}

export default AdminController;