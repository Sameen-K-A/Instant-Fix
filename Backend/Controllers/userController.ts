import { Request, Response } from "express";
import UserServices from "../Services/userServices";
import UserRepository from "../Repository/userRepository";
import { userType } from "../Interfaces";

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
         } else if (error.message === "User is blocked") {
            res.status(403).json({ message: "User is blocked" });
         } else {
            res.status(500).json({ message: "Something wrong please try again later" });
         }
      }
   };

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
   };

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
   };

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
   };

   async add_EditAddress_controller(req: Request, res: Response): Promise<void> {
      try {
         const { addAndEditAddressDetails, user_id } = req.body;
         await userServices.add_EditAddressService(addAndEditAddressDetails, user_id);
         res.status(200).json({ message: "Address modified successfully" });
      } catch (error) {
         console.log("Add user address controller error : ", error);
         res.status(500).json(error)
      }
   };

   async deleteAddress_controller(req: Request, res: Response): Promise<void> {
      try {
         const user_id: string = req.query.user_id as string;
         const serviceResponse = await userServices.deleteAddressService(user_id);
         res.status(200).send(serviceResponse);
      } catch (error) {
         console.log("delete address controller error : ", error);
         res.status(500).json(error);
      }
   };

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
   };

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
   };

   async fetchTechnician_controller(req: Request, res: Response) {
      try {
         const user_id = req.query.user_id as string;
         const serviceResponse = await userServices.fetchTechnicianService(user_id);
         res.status(200).json(serviceResponse);
      } catch (error) {
         res.status(500).json(error)
      }
   };

   async fetchAlreadyChattedTechnicians_controller(req: Request, res: Response) {
      try {
         const user_id = req.query.user_id as string;
         const techniciansList = await userServices.fetchAlreadyChattedTechniciansService(user_id);
         res.status(200).json(techniciansList);
      } catch (error) {
         res.status(500).json(error);
      };
   };

   async bookTechnician_controller(req: Request, res: Response) {
      try {
         const { clientID, technicianUserID } = req.body;
         const response = await userServices.bookTechnicianService(clientID, technicianUserID);
         res.status(200).json(response);
      } catch (error: any) {
         if (error.message === "Booking failed") {
            res.status(409).send("Booking failed")
         } else if (error.message === "Technician not available now") {
            res.status(404).send("Technician not available now")
         } else {
            res.status(500).json(error);
         };
      };
   };

   async fetchAnyPendingRequestAvailable_controller(req: Request, res: Response) {
      try {
         const clientID = req.query.clientID as string;
         const technicianUserID = req.query.technicianUserID as string;
         const response = await userServices.fetchAnyPendingRequestAvailableService(clientID, technicianUserID);
         res.status(200).send(response);
      } catch (error) {
         res.status(500).json(error);
      }
   };
};

export default UserController;