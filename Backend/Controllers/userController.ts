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
         await userServices.registerUserService(userData);
         res.status(200).send("OTP sended to mail");
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
         const enteredOTP: string = req.body.enteredOTP;
         const serviceResponse = await userServices.otpVerifiedService(enteredOTP);
         res.status(200).json(serviceResponse);
      } catch (error: any) {
         if (error.message === "Incorrect OTP") {
            res.status(401).json({ message: "Incorrect OTP" })
         } else if (error.message === "OTP is expired") {
            res.status(410).json({ message: "OTP has expired" });
         } else {
            res.status(500).json({ message: "Something went wrong. Please try again later." });
         }
      }
   }

   async resendOTP_controller(req: Request, res: Response) {
      try {
         await userServices.resendOTPService();
         res.status(200).send("OTP sended");
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
         res.status(200).json(serviceResponse);
      } catch (error) {
         console.log("fetch address controller error : ", error);
         res.status(500).send("Something wrong please try again later.")
      }
   }

   async addAddress_controller(req: Request, res: Response): Promise<void> {
      try {
         const addressData: userAddressType = req.body;
         const serviceResponse = await userServices.addAddressService(addressData);
         res.status(200).json(serviceResponse);
      } catch (error) {
         console.log("Add user address controller error : ", error);
         res.status(500).json(error)
      }
   }

   async deleteAddress_controller(req: Request, res: Response): Promise<void> {
      try {
         const address_id: string = req.query.address_id as string;
         const serviceResponse = await userServices.deleteAddressService(address_id);
         res.status(200).send(serviceResponse);
      } catch (error) {
         console.log("delete address controller error : ", error);
         res.status(500).json(error);
      }
   }

   async editAddress_controller(req: Request, res: Response): Promise<void> {
      try {
         const { address_id, name, address, pincode, phone, alternatePhone } = req.body;
         await userServices.editAddressService(address_id, name, address, pincode, phone, alternatePhone);
         res.status(200).send("Address changed successfully");
      } catch (error: any) {
         if (error.message === "No changes founded") {
            res.status(304).json({ message: "No changes founded" });
         } else {
            console.error("Internal Server Error:", error);
            res.status(500).send("Internal server error");
         }
      }
   }

   async changePassword_controller(req: Request, res: Response): Promise<void> {
      try {
         const { user_id, currentPass, newPass } = req.body;
         await userServices.changePasswordService(user_id, currentPass, newPass);
         res.status(200).send("Password changed successfully");
      } catch (error: any) {
         if (error.message === "Current password is wrong") {
            res.status(401).json({ message: "Current password is wrong" });
         } else if (error.message === "User not found") {
            res.status(404).json({ message: "User not found" });
         } else {
            res.status(500).json({ message: "Internal server error" });
         }
      }
   }

   async editprofile_controller(req: Request, res: Response) {
      try {
         const { user_id, name, phone, defaultProfileImage } = req.body;
         const selectedProfileImage = req.file;
         let profileIMG: string | null = null;
         if (selectedProfileImage) {
            profileIMG = selectedProfileImage.filename;
         } else if (defaultProfileImage) {
            profileIMG = defaultProfileImage.split("/").pop();
         }
         await userServices.editProfileService(user_id, name, phone, profileIMG);
         res.status(200).send("Changes completed successfully");
      } catch (error: any) {
         if (error.message === "No changes founded") {
            res.status(304).json({ message: "No changes founded" });
         } else {
            res.status(500).json({ message: 'Internal Server Error' });
         }
      }
   }

}

export default UserController;