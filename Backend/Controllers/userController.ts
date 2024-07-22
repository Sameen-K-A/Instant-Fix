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
         await userServices.registerUserService(userData);
         res.json("Okay fine");
      } catch (error) {
         console.log(error);
      }
   }

}

export default UserController;