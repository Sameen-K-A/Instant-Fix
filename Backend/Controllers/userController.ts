import { Request, Response } from "express";
import UserServices from "../Services/userServices";
import UserRepository from "../Repository/userRepository";
import { userType } from "../Model/userModal";

const userRepository = new UserRepository();
const userServices = new UserServices(userRepository);

class UserController {

   async register_controller(req: Request, res: Response): Promise<void> {
      try {
         const userData: userType = req.body;
         const serviceResponse = await userServices.registerUserService(userData);
         res.json({ serviceResponse, userData });
      } catch (error) {
         console.log(error);
      }
   }

   async verifyOTP_controller(req: Request, res: Response): Promise<void> {
      try {
         const userData: userType = req.body;
         const serviceResponse = await userServices.otpVerifiedService(userData);
         res.json(serviceResponse);
      } catch (error) {
         console.log(error);
      }
   }

}

export default UserController;