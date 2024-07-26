import { Request, Response } from "express";
import UserServices from "../Services/userServices";
import UserRepository from "../Repository/userRepository";
import { userType } from "../Model/userModal";
import { userAddressType } from "../Model/userAddressModal";

const userRepository = new UserRepository();
const userServices = new UserServices(userRepository);

class UserController {

   async loginController(req: Request, res: Response) {
      try {
         const { email, password } = req.body;
         const serviceResponse = await userServices.loginUserService(email, password);
         return res.status(200).json(serviceResponse);
      } catch (error: any) {
         if (error.message === "email not found") {
            res.status(404).json({ message: "email not found" });
         } else if (error.message === "Wrong password") {
            res.status(401).json({ message: "Wrong password" });
         } else {
            res.status(500).json({ message: "Something wrong please try again later" });
         }
      }
   }

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

   async fetchAddress_controller(req: Request, res: Response): Promise<void> {
      try {
         const user_id: string = req.query.user_id as string;
         const serviceResponse = await userServices.fetchAddressService(user_id);
         res.json(serviceResponse);
      } catch (error) {
         console.log(error);
      }
   }

   async addAddress_controller(req: Request, res: Response): Promise<void> {
      try {
         const addressData: userAddressType = req.body;
         const serviceResponse = await userServices.addAddressService(addressData);
         res.json(serviceResponse);
      } catch (error) {
         console.log(error);
      }
   }

   async deleteAddress_controller(req: Request, res: Response): Promise<void> {
      try {
         const address_id: string = req.query.address_id as string;
         const serviceResponse = await userServices.deleteAddressService(address_id);
         res.send(serviceResponse);
      } catch (error) {
         console.log(error);
      }
   }

}

export default UserController;