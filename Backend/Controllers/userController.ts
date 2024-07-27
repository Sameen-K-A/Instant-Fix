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
         res.status(200).json({
            OTP: serviceResponse.OTP,
            expiryTime: serviceResponse.expiryOTP_time,
            userData: userData
         });
      } catch (error: any) {
         if (error.message === "Email already exists") {
            res.status(409).json({ message: "Email already exists" });
         } else if (error.message === "Email not send") {
            res.status(500).json({ message: "Email not send" });
         } else {
            res.status(500).json({ message: "Something wrong please try again later" });
         }
      }
   }

   async verifyOTP_controller(req: Request, res: Response): Promise<void> {
      try {
         const userData: userType = req.body;
         const serviceResponse = await userServices.otpVerifiedService(userData);
         res.status(200).json(serviceResponse);
      } catch (error: any) {
         res.status(500).json({ message: "Something went wrong. Please try again later." });
      }
   }

   async resendOTP_controller(req: Request, res: Response) {
      try {
         const email: string = req.body.email;
         const serviceResponse = await userServices.resendOTPService(email);
         res.status(200).json({
            OTP: serviceResponse.OTP,
            expiryTime: serviceResponse.expiryOTP_time,
         });
      } catch (error: any) {
         if (error.message === "Email not send") {
            res.status(500).json({ message: "Email not send" });
         } else {
            res.status(500).json({ message: "Something wrong please try again later" });
         }
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