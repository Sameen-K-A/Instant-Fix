import { Request, Response } from "express";
import UserServices from "../Services/userServices";
import UserRepository from "../Repository/userRepository";
import { userType } from "../interfaces";
import HTTP_statusCode from "../Enums/httpStatusCode";

const userRepository = new UserRepository();
const userServices = new UserServices(userRepository);

class UserController {

   async loginController(req: Request, res: Response) {
      try {
         const { email, password } = req.body;
         const serviceResponse = await userServices.loginUserService(email, password);
         return res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error: any) {
         if (error.message === "email not found") {
            res.status(HTTP_statusCode.NotFound).json({ message: "email not found" });
         } else if (error.message === "Wrong password") {
            res.status(HTTP_statusCode.Unauthorized).json({ message: "Wrong password" });
         } else if (error.message === "User is blocked") {
            res.status(HTTP_statusCode.NoAccess).json({ message: "User is blocked" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Something wrong please try again later" });
         }
      }
   };

   async register_controller(req: Request, res: Response): Promise<void> {
      try {
         const userData: userType = req.body;
         await userServices.registerUserService(userData);
         res.status(HTTP_statusCode.OK).send("OTP sended to mail");
      } catch (error: any) {
         if (error.message === "Email already exists") {
            res.status(HTTP_statusCode.Conflict).json({ message: "Email already exists" });
         } else if (error.message === "Email not send") {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Email not send" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Something wrong please try again later" });
         }
      }
   };

   async verifyOTP_controller(req: Request, res: Response): Promise<void> {
      try {
         const enteredOTP: string = req.body.enteredOTP;
         const serviceResponse = await userServices.otpVerifiedService(enteredOTP);
         res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error: any) {
         if (error.message === "Incorrect OTP") {
            res.status(HTTP_statusCode.Unauthorized).json({ message: "Incorrect OTP" })
         } else if (error.message === "OTP is expired") {
            res.status(HTTP_statusCode.Expired).json({ message: "OTP has expired" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Something went wrong. Please try again later." });
         }
      }
   };

   async resendOTP_controller(req: Request, res: Response) {
      try {
         await userServices.resendOTPService();
         res.status(HTTP_statusCode.OK).send("OTP sended");
      } catch (error: any) {
         if (error.message === "Email not send") {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Email not send" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Something wrong please try again later" });
         }
      }
   };

   async add_EditAddress_controller(req: Request, res: Response): Promise<void> {
      try {
         const { addAndEditAddressDetails, user_id } = req.body;
         await userServices.add_EditAddressService(addAndEditAddressDetails, user_id);
         res.status(HTTP_statusCode.OK).json({ message: "Address modified successfully" });
      } catch (error) {
         console.log("Add user address controller error : ", error);
         res.status(HTTP_statusCode.InternalServerError).json(error)
      }
   };

   async deleteAddress_controller(req: Request, res: Response): Promise<void> {
      try {
         const user_id: string = req.query.user_id as string;
         const serviceResponse = await userServices.deleteAddressService(user_id);
         res.status(HTTP_statusCode.OK).send(serviceResponse);
      } catch (error) {
         console.log("delete address controller error : ", error);
         res.status(HTTP_statusCode.InternalServerError).json(error);
      }
   };

   async changePassword_controller(req: Request, res: Response): Promise<void> {
      try {
         const { user_id, currentPass, newPass } = req.body;
         await userServices.changePasswordService(user_id, currentPass, newPass);
         res.status(HTTP_statusCode.OK).send("Password changed successfully");
      } catch (error: any) {
         if (error.message === "Current password is wrong") {
            res.status(HTTP_statusCode.Unauthorized).json({ message: "Current password is wrong" });
         } else if (error.message === "User not found") {
            res.status(HTTP_statusCode.NotFound).json({ message: "User not found" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Internal server error" });
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
         res.status(HTTP_statusCode.OK).send("Changes completed successfully");
      } catch (error: any) {
         if (error.message === "No changes founded") {
            res.status(HTTP_statusCode.NoChange).json({ message: "No changes founded" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: 'Internal Server Error' });
         }
      }
   };

   async saveTechnicianController(req: Request, res: Response) {
      try {
         const { user_id, technicianId } = req.body;
         await userServices.saveTechnicianService(user_id as string, technicianId as string);
         res.status(HTTP_statusCode.OK).send("Save technician completed successfully");
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Can't save technician");
      };
   };

   async unSaveTechnicianController(req: Request, res: Response) {
      try {
         const { user_id, technicianId } = req.body;
         await userServices.unSaveTechnicianService(user_id as string, technicianId as string);
         res.status(HTTP_statusCode.OK).send("Unsave technician completed successfully");
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Can't unsave technician");
      };
   };

   async fetchSavedTechnicianDetailsController(req: Request, res: Response) {
      try {
         const user_id: string = req.query.user_id as string;
         const responseFromService = await userServices.fetchSavedTechnicianDetailsService(user_id);
         res.status(HTTP_statusCode.OK).json(responseFromService);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong, please try again later.");
      };
   };

   async fetchTechnician_controller(req: Request, res: Response) {
      try {
         const user_id = req.query.user_id as string;
         const serviceResponse = await userServices.fetchTechnicianService(user_id);
         res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).json(error)
      };
   };

   async fetchTechnicianIndividualInformationController(req: Request, res: Response) {
      try {
         const technicianUser_id: string = req.query.technicianUser_id as string;
         const responseFromService = await userServices.fetchTechnicianIndividualInformationService(technicianUser_id);
         res.status(HTTP_statusCode.OK).json(responseFromService);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Somthing wrong please try again later");
      };
   };

   async fetchAlreadyChattedTechnicians_controller(req: Request, res: Response) {
      try {
         const user_id = req.query.user_id as string;
         const techniciansList = await userServices.fetchAlreadyChattedTechniciansService(user_id);
         res.status(HTTP_statusCode.OK).json(techniciansList);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).json(error);
      };
   };

   async bookTechnician_controller(req: Request, res: Response) {
      try {
         const { client_id, client_name, technicianDetails, serviceLocation, selectedDate } = req.body;
         const response = await userServices.bookTechnicianService(client_id, client_name, technicianDetails, serviceLocation, selectedDate);
         res.status(HTTP_statusCode.OK).json(response);
      } catch (error: any) {
         if (error.message === "Technician is not available on selected date") {
            res.status(HTTP_statusCode.ServiceUnavailable).send("Technician is not available on selected date");
         } else if (error.message === "Booking failed") {
            res.status(HTTP_statusCode.Conflict).send("Booking failed")
         } else if (error.message === "Technician not available") {
            res.status(HTTP_statusCode.NotFound).send("Technician not available")
         } else if (error.message === "Unable to find location for the provided pincode.") {
            res.status(HTTP_statusCode.NoAccess).send("Unable to find location for the provided pincode.")
         } else {
            console.log(error);
            res.status(HTTP_statusCode.InternalServerError).json(error);
         };
      };
   };

   async fetchUserBookingHistory_controller(req: Request, res: Response) {
      try {
         const user_id = req.query.user_id as string;
         const response = await userServices.fetchUserBookingHistoryService(user_id);
         res.status(HTTP_statusCode.OK).json(response);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).json(error);
      };
   };

   async fetchIndividualBookingInformation_controller(req: Request, res: Response) {
      try {
         const booking_id: string = req.query.booking_id as string;
         const response = await userServices.fetchIndividualBookingInformationService(booking_id);
         res.status(HTTP_statusCode.OK).json(response);
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.");
      }
   };

   async cancelBooking_controller(req: Request, res: Response) {
      try {
         const { booking_id, technician_id, userName, serviceDate } = req.body;
         await userServices.cancelBookingService(booking_id, technician_id, userName, serviceDate);
         res.status(HTTP_statusCode.OK).send("Booking cancelled successfully.");
      } catch (error: any) {
         if (error.message === "Booking status is not changed") {
            res.status(HTTP_statusCode.NoChange).json("Booking status is not changed");
         } else {
            res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.");
         };
      };
   };

   async proceedToPaymentController(req: Request, res: Response) {
      try {
         const { booking_id, laborCost } = req.body;
         const response = await userServices.proceedToPaymentService(booking_id, laborCost);
         res.status(HTTP_statusCode.OK).json({ order_id: response.id, currency: response.currency, amount: response.amount, });
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.");
      };
   };

   async verifyPaymentController(req: Request, res: Response) {
      try {
         const { payment_id, order_id, signature, booking_id, amount, technicianUser_id } = req.body;
         await userServices.verifyPaymentService(payment_id, order_id, signature, booking_id, amount, technicianUser_id);
         res.status(HTTP_statusCode.OK).send("Payment verified successfully");
      } catch (error: any) {
         if (error.message === "Invalid payment verification") {
            res.status(HTTP_statusCode.BadRequest).send("Invalid payment verification");
         } else if (error.message === "Payment failed") {
            res.status(HTTP_statusCode.TaskFailed).send("Payment failed");
         } else {
            res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.");
         };
      };
   };

   async submitReviewController(req: Request, res: Response) {
      try {
         const { user_id, technicianUser_id, enteredRating, enteredFeedback, booking_id } = req.body;
         await userServices.submitReviewService(user_id, technicianUser_id, enteredRating, enteredFeedback, booking_id);
         res.status(HTTP_statusCode.OK).send("Feedback submitted successfully");
      } catch (error) {
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later");
      };
   };

};

export default UserController;