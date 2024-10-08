import { Request, Response } from "express";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { IUserService } from "../Interfaces/user.service.interface";
import { IUser } from "../Interfaces/common.interface";
class UserController {

   private userService: IUserService;

   constructor(userService: IUserService) {
      this.userService = userService;
   };

   login = async (req: Request, res: Response) => {
      try {
         const { email, password } = req.body;
         const serviceResponse = await this.userService.login(email, password);
         res.cookie("RefreshToken", serviceResponse.userRefreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
         });
         res.cookie("AccessToken", serviceResponse.userToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 15 * 60 * 1000,
         });
         res.status(HTTP_statusCode.OK).json({ userData: serviceResponse.userData });
      } catch (error: any) {
         console.log("User:= login error", error);
         if (error.message === "email not found") {
            res.status(HTTP_statusCode.NotFound).json({ message: "email not found" });
         } else if (error.message === "Wrong password") {
            res.status(HTTP_statusCode.Unauthorized).json({ message: "Wrong password" });
         } else if (error.message === "User is blocked") {
            res.status(HTTP_statusCode.NoAccess).json({ message: "User is blocked" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Something wrong please try again later" });
         };
      };
   };

   verifyGoogleAuth = async (req: Request, res: Response) => {
      try {
         const token: string = req.body.token as string;
         const serviceResponse = await this.userService.verifyGoogleAuth(token);
         res.cookie("RefreshToken", serviceResponse.userRefreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
         });
         res.cookie("AccessToken", serviceResponse.userToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 15 * 60 * 1000,
         });
         res.status(HTTP_statusCode.OK).json({ userData: serviceResponse.userData });
      } catch (error: any) {
         console.log("User:= google login error", error);
         if (error.message === "User not found") {
            res.status(HTTP_statusCode.NotFound).json({ message: "User not found" });
         } else if (error.message === "User is blocked") {
            res.status(HTTP_statusCode.NoAccess).json({ message: "User is blocked" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Something wrong please try again later" });
         };
      };
   };

   register = async (req: Request, res: Response) => {
      try {
         const userData: IUser = req.body;
         await this.userService.register(userData);
         res.status(HTTP_statusCode.OK).send("OTP sended to mail");
      } catch (error: any) {
         console.log("User:= register error", error);
         if (error.message === "Email already exists") {
            res.status(HTTP_statusCode.Conflict).json({ message: "Email already exists" });
         } else if (error.message === "Email not send") {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Email not send" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Something wrong please try again later" });
         };
      };
   };

   otpVerification = async (req: Request, res: Response) => {
      try {
         const enteredOTP: string = req.body.enteredOTP;
         const serviceResponse = await this.userService.otpVerification(enteredOTP);
         res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error: any) {
         console.log("User:= otp verification error", error);
         if (error.message === "Incorrect OTP") {
            res.status(HTTP_statusCode.Unauthorized).json({ message: "Incorrect OTP" })
         } else if (error.message === "OTP is expired") {
            res.status(HTTP_statusCode.Expired).json({ message: "OTP is expired" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Something went wrong. Please try again later." });
         };
      };
   };

   resendOTP = async (req: Request, res: Response) => {
      try {
         await this.userService.resendOTP();
         res.status(HTTP_statusCode.OK).send("OTP sended");
      } catch (error: any) {
         console.log("User:= resend otp error", error);
         if (error.message === "Email not send") {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Email not send" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Something wrong please try again later" });
         };
      };
   };

   createUpdateAddress = async (req: Request, res: Response) => {
      try {
         const { addAndEditAddressDetails, user_id } = req.body;
         await this.userService.createUpdateAddress(addAndEditAddressDetails, user_id);
         res.status(HTTP_statusCode.OK).json({ message: "Address modified successfully" });
      } catch (error: any) {
         console.log("User:= update address error", error);
         if (error.message === "Failed to update address") {
            res.status(HTTP_statusCode.NoChange).send("Failed to update address");
         } else {
            res.status(HTTP_statusCode.InternalServerError).json(error)
         };
      };
   };

   deleteAddress = async (req: Request, res: Response) => {
      try {
         const user_id: string = req.query.user_id as string;
         const serviceResponse = await this.userService.deleteAddress(user_id);
         res.status(HTTP_statusCode.OK).send(serviceResponse);
      } catch (error: any) {
         console.log("User:= delete address error", error);
         if (error.message === "Failed to delete address") {
            res.status(HTTP_statusCode.NoChange).send("Failed to update address");
         } else {
            res.status(HTTP_statusCode.InternalServerError).json(error)
         };
      };
   };

   updatePassword = async (req: Request, res: Response) => {
      try {
         const { user_id, currentPass, newPass } = req.body;
         await this.userService.updatePassword(user_id, currentPass, newPass);
         res.status(HTTP_statusCode.OK).send("Password changed successfully");
      } catch (error: any) {
         console.log("User:= update password error", error);
         if (error.message === "Current password is wrong") {
            res.status(HTTP_statusCode.Unauthorized).json({ message: "Current password is wrong" });
         } else if (error.message === "User not found") {
            res.status(HTTP_statusCode.NotFound).json({ message: "User not found" });
         } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: "Internal server error" });
         };
      };
   };

   updateProfileDetails = async (req: Request, res: Response) => {
      try {
         const { user_id, name, phone } = req.body;
         await this.userService.updateProfileDetails(user_id, name, phone);
         res.status(HTTP_statusCode.OK).send("Changes completed successfully");
      } catch (error: any) {
         console.log("User:= update profile details error", error);
         if (error.message === "Failed to update profile") {
            res.status(HTTP_statusCode.NoChange).send("Failed to update profile")
         } else {
            res.status(HTTP_statusCode.InternalServerError).json({ message: 'Internal Server Error' });
         };
      };
   };

   updateProfileImage = async (req: Request, res: Response) => {
      try {
         const { user_id, imageName } = req.body;
         const result = await this.userService.updateProfileImage(user_id, imageName);
         res.status(HTTP_statusCode.OK).json(result);
      } catch (error: any) {
         console.log("User:= update profile image error", error);
         if (error.message === "Failed to update user profile") {
            res.status(HTTP_statusCode.NoChange).send("Failed to update user profile");
         } else {
            res.status(HTTP_statusCode.InternalServerError).send("Something went wrong, please try again later");
         };
      };
   };

   getPreSignedURL = async (req: Request, res: Response) => {
      try {
         const { imageName, imageType } = req.query;
         const response = await this.userService.getPreSignedURL(imageName as string, imageType as string)
         res.status(HTTP_statusCode.OK).json(response);
      } catch (error) {
         console.log("User:= generate presigned url error", error);
         res.status(HTTP_statusCode.InternalServerError).send("Somthing wrong please try again later");
      };
   };

   followTechnician = async (req: Request, res: Response) => {
      try {
         const { user_id, technicianId } = req.body;
         await this.userService.followTechnician(user_id as string, technicianId as string);
         res.status(HTTP_statusCode.OK).send("Save technician completed successfully");
      } catch (error: any) {
         console.log("User:= save technician error", error);
         if (error.message === "Failed to follow technician") {
            res.status(HTTP_statusCode.NoChange).send("Failed to follow technician");
         } else {
            res.status(HTTP_statusCode.InternalServerError).json(error)
         };
      };
   };

   unfollowTechnician = async (req: Request, res: Response) => {
      try {
         const { user_id, technicianId } = req.body;
         await this.userService.unfollowTechnician(user_id as string, technicianId as string);
         res.status(HTTP_statusCode.OK).send("Unsave technician completed successfully");
      } catch (error: any) {
         console.log("User:= un save error", error);
         if (error.message === "Failed to unfollow technician") {
            res.status(HTTP_statusCode.NoChange).send("Failed to unfollow technician");
         } else {
            res.status(HTTP_statusCode.InternalServerError).json(error)
         };
      };
   };

   getFollowedTechnicians = async (req: Request, res: Response) => {
      try {
         const user_id: string = req.query.user_id as string;
         const responseFromService = await this.userService.getFollowedTechnicians(user_id);
         res.status(HTTP_statusCode.OK).json(responseFromService);
      } catch (error) {
         console.log("User:= get saved technician list error", error);
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong, please try again later.");
      };
   };

   getTechnicians = async (req: Request, res: Response) => {
      try {
         const user_id = req.query.user_id as string;
         const serviceResponse = await this.userService.getTechnicians(user_id);
         res.status(HTTP_statusCode.OK).json(serviceResponse);
      } catch (error) {
         console.log("User:= fetch all technicians error", error);
         res.status(HTTP_statusCode.InternalServerError).json(error)
      };
   };

   getTechnicianWithPersonalDetails = async (req: Request, res: Response) => {
      try {
         const technicianUser_id: string = req.query.technicianUser_id as string;
         const responseFromService = await this.userService.getTechnicianWithPersonalDetails(technicianUser_id);
         res.status(HTTP_statusCode.OK).json(responseFromService);
      } catch (error) {
         console.log("User:= get technician profile with personal detail error", error);
         res.status(HTTP_statusCode.InternalServerError).send("Somthing wrong please try again later");
      };
   };

   getChatFriends = async (req: Request, res: Response) => {
      try {
         const user_id = req.query.user_id as string;
         const techniciansList = await this.userService.getChatFriends(user_id);
         res.status(HTTP_statusCode.OK).json(techniciansList);
      } catch (error) {
         console.log("User:= get chat friends error", error);
         res.status(HTTP_statusCode.InternalServerError).json(error);
      };
   };

   bookTechnician = async (req: Request, res: Response) => {
      try {
         const { client_id, client_name, technicianDetails, serviceLocation, selectedDate } = req.body;
         const response = await this.userService.bookTechnician(client_id, client_name, technicianDetails, serviceLocation, selectedDate);
         res.status(HTTP_statusCode.OK).json(response);
      } catch (error: any) {
         console.log("User:= book technician slot error", error);
         if (error.message === "Technician is not available on selected date") {
            res.status(HTTP_statusCode.ServiceUnavailable).send("Technician is not available on selected date");
         } else if (error.message === "Booking failed") {
            res.status(HTTP_statusCode.Conflict).send("Booking failed")
         } else if (error.message === "Technician not available") {
            res.status(HTTP_statusCode.NotFound).send("Technician not available")
         } else if (error.message === "Unable to find location for the provided pincode.") {
            res.status(HTTP_statusCode.NoAccess).send("Unable to find location for the provided pincode.")
         } else {
            res.status(HTTP_statusCode.InternalServerError).json(error);
         };
      };
   };

   getBookingsHistory = async (req: Request, res: Response) => {
      try {
         const user_id = req.query.user_id as string;
         const response = await this.userService.getBookingsHistory(user_id);
         res.status(HTTP_statusCode.OK).json(response);
      } catch (error) {
         console.log("User:= get booking history error", error);
         res.status(HTTP_statusCode.InternalServerError).json(error);
      };
   };

   getBookingDetails = async (req: Request, res: Response) => {
      try {
         const booking_id: string = req.query.booking_id as string;
         const response = await this.userService.getBookingDetails(booking_id);
         res.status(HTTP_statusCode.OK).json(response);
      } catch (error) {
         console.log("User:= get booking individual booking details error", error);
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.");
      }
   };

   cancelBooking = async (req: Request, res: Response) => {
      try {
         const { booking_id, technician_id, userName, serviceDate } = req.body;
         await this.userService.cancelBooking(booking_id, technician_id, userName, serviceDate);
         res.status(HTTP_statusCode.OK).send("Booking cancelled successfully.");
      } catch (error: any) {
         console.log("User:= cancel booking error", error);
         if (error.message === "Failed to cancel booking") {
            res.status(HTTP_statusCode.NoChange).json("Failed to cancel booking");
         } else {
            res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.");
         };
      };
   };

   proceedToPayment = async (req: Request, res: Response) => {
      try {
         const { booking_id, laborCost } = req.body;
         const response = await this.userService.proceedToPayment(booking_id, laborCost);
         res.status(HTTP_statusCode.OK).json({ order_id: response.id, currency: response.currency, amount: response.amount, });
      } catch (error) {
         console.log("User:= proceed to payement error", error);
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.");
      };
   };

   verifyPayment = async (req: Request, res: Response) => {
      try {
         const { payment_id, order_id, signature, booking_id, amount, technicianUser_id } = req.body;
         await this.userService.verifyPayment(payment_id, order_id, signature, booking_id, amount, technicianUser_id);
         res.status(HTTP_statusCode.OK).send("Payment verified successfully");
      } catch (error: any) {
         console.log("User:= verify payment error", error);
         if (error.message === "Invalid payment verification") {
            res.status(HTTP_statusCode.BadRequest).send("Invalid payment verification");
         } else if (error.message === "Payment failed") {
            res.status(HTTP_statusCode.TaskFailed).send("Payment failed");
         } else {
            res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later.");
         };
      };
   };

   submitReview = async (req: Request, res: Response) => {
      try {
         const { user_id, technicianUser_id, enteredRating, enteredFeedback, booking_id } = req.body;
         await this.userService.submitReview(user_id, technicianUser_id, enteredRating, enteredFeedback, booking_id);
         res.status(HTTP_statusCode.OK).send("Feedback submitted successfully");
      } catch (error) {
         console.log("User:= submit review error", error);
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later");
      };
   };

   logout = async (req: Request, res: Response) => {
      try {
         res.clearCookie("AccessToken", { httpOnly: true });
         res.clearCookie("RefreshToken", { httpOnly: true });
         res.status(HTTP_statusCode.OK).json('Logged out successfully');
      } catch (error) {
         console.log("User:= logout error", error);
         res.status(HTTP_statusCode.InternalServerError).send("Something wrong please try again later")
      };
   };

};

export default UserController;