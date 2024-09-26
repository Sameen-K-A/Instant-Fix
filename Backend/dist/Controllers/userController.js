"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
class UserController {
    constructor(userService) {
        this.login = async (req, res) => {
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
                res.status(httpStatusCode_1.default.OK).json({ userData: serviceResponse.userData });
            }
            catch (error) {
                console.log("User:= login error", error);
                if (error.message === "email not found") {
                    res.status(httpStatusCode_1.default.NotFound).json({ message: "email not found" });
                }
                else if (error.message === "Wrong password") {
                    res.status(httpStatusCode_1.default.Unauthorized).json({ message: "Wrong password" });
                }
                else if (error.message === "User is blocked") {
                    res.status(httpStatusCode_1.default.NoAccess).json({ message: "User is blocked" });
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json({ message: "Something wrong please try again later" });
                }
                ;
            }
            ;
        };
        this.verifyGoogleAuth = async (req, res) => {
            try {
                const token = req.body.token;
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
                res.status(httpStatusCode_1.default.OK).json({ userData: serviceResponse.userData });
            }
            catch (error) {
                console.log("User:= google login error", error);
                if (error.message === "User not found") {
                    res.status(httpStatusCode_1.default.NotFound).json({ message: "User not found" });
                }
                else if (error.message === "User is blocked") {
                    res.status(httpStatusCode_1.default.NoAccess).json({ message: "User is blocked" });
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json({ message: "Something wrong please try again later" });
                }
                ;
            }
            ;
        };
        this.register = async (req, res) => {
            try {
                const userData = req.body;
                await this.userService.register(userData);
                res.status(httpStatusCode_1.default.OK).send("OTP sended to mail");
            }
            catch (error) {
                console.log("User:= register error", error);
                if (error.message === "Email already exists") {
                    res.status(httpStatusCode_1.default.Conflict).json({ message: "Email already exists" });
                }
                else if (error.message === "Email not send") {
                    res.status(httpStatusCode_1.default.InternalServerError).json({ message: "Email not send" });
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json({ message: "Something wrong please try again later" });
                }
                ;
            }
            ;
        };
        this.otpVerification = async (req, res) => {
            try {
                const enteredOTP = req.body.enteredOTP;
                const serviceResponse = await this.userService.otpVerification(enteredOTP);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                console.log("User:= otp verification error", error);
                if (error.message === "Incorrect OTP") {
                    res.status(httpStatusCode_1.default.Unauthorized).json({ message: "Incorrect OTP" });
                }
                else if (error.message === "OTP is expired") {
                    res.status(httpStatusCode_1.default.Expired).json({ message: "OTP is expired" });
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json({ message: "Something went wrong. Please try again later." });
                }
                ;
            }
            ;
        };
        this.resendOTP = async (req, res) => {
            try {
                await this.userService.resendOTP();
                res.status(httpStatusCode_1.default.OK).send("OTP sended");
            }
            catch (error) {
                console.log("User:= resend otp error", error);
                if (error.message === "Email not send") {
                    res.status(httpStatusCode_1.default.InternalServerError).json({ message: "Email not send" });
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json({ message: "Something wrong please try again later" });
                }
                ;
            }
            ;
        };
        this.createUpdateAddress = async (req, res) => {
            try {
                const { addAndEditAddressDetails, user_id } = req.body;
                await this.userService.createUpdateAddress(addAndEditAddressDetails, user_id);
                res.status(httpStatusCode_1.default.OK).json({ message: "Address modified successfully" });
            }
            catch (error) {
                console.log("User:= update address error", error);
                if (error.message === "Failed to update address") {
                    res.status(httpStatusCode_1.default.NoChange).send("Failed to update address");
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json(error);
                }
                ;
            }
            ;
        };
        this.deleteAddress = async (req, res) => {
            try {
                const user_id = req.query.user_id;
                const serviceResponse = await this.userService.deleteAddress(user_id);
                res.status(httpStatusCode_1.default.OK).send(serviceResponse);
            }
            catch (error) {
                console.log("User:= delete address error", error);
                if (error.message === "Failed to delete address") {
                    res.status(httpStatusCode_1.default.NoChange).send("Failed to update address");
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json(error);
                }
                ;
            }
            ;
        };
        this.updatePassword = async (req, res) => {
            try {
                const { user_id, currentPass, newPass } = req.body;
                await this.userService.updatePassword(user_id, currentPass, newPass);
                res.status(httpStatusCode_1.default.OK).send("Password changed successfully");
            }
            catch (error) {
                console.log("User:= update password error", error);
                if (error.message === "Current password is wrong") {
                    res.status(httpStatusCode_1.default.Unauthorized).json({ message: "Current password is wrong" });
                }
                else if (error.message === "User not found") {
                    res.status(httpStatusCode_1.default.NotFound).json({ message: "User not found" });
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json({ message: "Internal server error" });
                }
                ;
            }
            ;
        };
        this.updateProfileDetails = async (req, res) => {
            try {
                const { user_id, name, phone } = req.body;
                await this.userService.updateProfileDetails(user_id, name, phone);
                res.status(httpStatusCode_1.default.OK).send("Changes completed successfully");
            }
            catch (error) {
                console.log("User:= update profile details error", error);
                if (error.message === "Failed to update profile") {
                    res.status(httpStatusCode_1.default.NoChange).send("Failed to update profile");
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json({ message: 'Internal Server Error' });
                }
                ;
            }
            ;
        };
        this.updateProfileImage = async (req, res) => {
            try {
                const { user_id, imageName } = req.body;
                const result = await this.userService.updateProfileImage(user_id, imageName);
                res.status(httpStatusCode_1.default.OK).json(result);
            }
            catch (error) {
                console.log("User:= update profile image error", error);
                if (error.message === "Failed to update user profile") {
                    res.status(httpStatusCode_1.default.NoChange).send("Failed to update user profile");
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).send("Something went wrong, please try again later");
                }
                ;
            }
            ;
        };
        this.getPreSignedURL = async (req, res) => {
            try {
                const { imageName, imageType } = req.query;
                const response = await this.userService.getPreSignedURL(imageName, imageType);
                res.status(httpStatusCode_1.default.OK).json(response);
            }
            catch (error) {
                console.log("User:= generate presigned url error", error);
                res.status(httpStatusCode_1.default.InternalServerError).send("Somthing wrong please try again later");
            }
            ;
        };
        this.followTechnician = async (req, res) => {
            try {
                const { user_id, technicianId } = req.body;
                await this.userService.followTechnician(user_id, technicianId);
                res.status(httpStatusCode_1.default.OK).send("Save technician completed successfully");
            }
            catch (error) {
                console.log("User:= save technician error", error);
                if (error.message === "Failed to follow technician") {
                    res.status(httpStatusCode_1.default.NoChange).send("Failed to follow technician");
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json(error);
                }
                ;
            }
            ;
        };
        this.unfollowTechnician = async (req, res) => {
            try {
                const { user_id, technicianId } = req.body;
                await this.userService.unfollowTechnician(user_id, technicianId);
                res.status(httpStatusCode_1.default.OK).send("Unsave technician completed successfully");
            }
            catch (error) {
                console.log("User:= un save error", error);
                if (error.message === "Failed to unfollow technician") {
                    res.status(httpStatusCode_1.default.NoChange).send("Failed to unfollow technician");
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json(error);
                }
                ;
            }
            ;
        };
        this.getFollowedTechnicians = async (req, res) => {
            try {
                const user_id = req.query.user_id;
                const responseFromService = await this.userService.getFollowedTechnicians(user_id);
                res.status(httpStatusCode_1.default.OK).json(responseFromService);
            }
            catch (error) {
                console.log("User:= get saved technician list error", error);
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong, please try again later.");
            }
            ;
        };
        this.getTechnicians = async (req, res) => {
            try {
                const user_id = req.query.user_id;
                const serviceResponse = await this.userService.getTechnicians(user_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                console.log("User:= fetch all technicians error", error);
                res.status(httpStatusCode_1.default.InternalServerError).json(error);
            }
            ;
        };
        this.getTechnicianWithPersonalDetails = async (req, res) => {
            try {
                const technicianUser_id = req.query.technicianUser_id;
                const responseFromService = await this.userService.getTechnicianWithPersonalDetails(technicianUser_id);
                res.status(httpStatusCode_1.default.OK).json(responseFromService);
            }
            catch (error) {
                console.log("User:= get technician profile with personal detail error", error);
                res.status(httpStatusCode_1.default.InternalServerError).send("Somthing wrong please try again later");
            }
            ;
        };
        this.getChatFriends = async (req, res) => {
            try {
                const user_id = req.query.user_id;
                const techniciansList = await this.userService.getChatFriends(user_id);
                res.status(httpStatusCode_1.default.OK).json(techniciansList);
            }
            catch (error) {
                console.log("User:= get chat friends error", error);
                res.status(httpStatusCode_1.default.InternalServerError).json(error);
            }
            ;
        };
        this.bookTechnician = async (req, res) => {
            try {
                const { client_id, client_name, technicianDetails, serviceLocation, selectedDate } = req.body;
                const response = await this.userService.bookTechnician(client_id, client_name, technicianDetails, serviceLocation, selectedDate);
                res.status(httpStatusCode_1.default.OK).json(response);
            }
            catch (error) {
                console.log("User:= book technician slot error", error);
                if (error.message === "Technician is not available on selected date") {
                    res.status(httpStatusCode_1.default.ServiceUnavailable).send("Technician is not available on selected date");
                }
                else if (error.message === "Booking failed") {
                    res.status(httpStatusCode_1.default.Conflict).send("Booking failed");
                }
                else if (error.message === "Technician not available") {
                    res.status(httpStatusCode_1.default.NotFound).send("Technician not available");
                }
                else if (error.message === "Unable to find location for the provided pincode.") {
                    res.status(httpStatusCode_1.default.NoAccess).send("Unable to find location for the provided pincode.");
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json(error);
                }
                ;
            }
            ;
        };
        this.getBookingsHistory = async (req, res) => {
            try {
                const user_id = req.query.user_id;
                const response = await this.userService.getBookingsHistory(user_id);
                res.status(httpStatusCode_1.default.OK).json(response);
            }
            catch (error) {
                console.log("User:= get booking history error", error);
                res.status(httpStatusCode_1.default.InternalServerError).json(error);
            }
            ;
        };
        this.getBookingDetails = async (req, res) => {
            try {
                const booking_id = req.query.booking_id;
                const response = await this.userService.getBookingDetails(booking_id);
                res.status(httpStatusCode_1.default.OK).json(response);
            }
            catch (error) {
                console.log("User:= get booking individual booking details error", error);
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later.");
            }
        };
        this.cancelBooking = async (req, res) => {
            try {
                const { booking_id, technician_id, userName, serviceDate } = req.body;
                await this.userService.cancelBooking(booking_id, technician_id, userName, serviceDate);
                res.status(httpStatusCode_1.default.OK).send("Booking cancelled successfully.");
            }
            catch (error) {
                console.log("User:= cancel booking error", error);
                if (error.message === "Failed to cancel booking") {
                    res.status(httpStatusCode_1.default.NoChange).json("Failed to cancel booking");
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later.");
                }
                ;
            }
            ;
        };
        this.proceedToPayment = async (req, res) => {
            try {
                const { booking_id, laborCost } = req.body;
                const response = await this.userService.proceedToPayment(booking_id, laborCost);
                res.status(httpStatusCode_1.default.OK).json({ order_id: response.id, currency: response.currency, amount: response.amount, });
            }
            catch (error) {
                console.log("User:= proceed to payement error", error);
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later.");
            }
            ;
        };
        this.verifyPayment = async (req, res) => {
            try {
                const { payment_id, order_id, signature, booking_id, amount, technicianUser_id } = req.body;
                await this.userService.verifyPayment(payment_id, order_id, signature, booking_id, amount, technicianUser_id);
                res.status(httpStatusCode_1.default.OK).send("Payment verified successfully");
            }
            catch (error) {
                console.log("User:= verify payment error", error);
                if (error.message === "Invalid payment verification") {
                    res.status(httpStatusCode_1.default.BadRequest).send("Invalid payment verification");
                }
                else if (error.message === "Payment failed") {
                    res.status(httpStatusCode_1.default.TaskFailed).send("Payment failed");
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later.");
                }
                ;
            }
            ;
        };
        this.submitReview = async (req, res) => {
            try {
                const { user_id, technicianUser_id, enteredRating, enteredFeedback, booking_id } = req.body;
                await this.userService.submitReview(user_id, technicianUser_id, enteredRating, enteredFeedback, booking_id);
                res.status(httpStatusCode_1.default.OK).send("Feedback submitted successfully");
            }
            catch (error) {
                console.log("User:= submit review error", error);
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later");
            }
            ;
        };
        this.logout = async (req, res) => {
            try {
                res.clearCookie("AccessToken", { httpOnly: true });
                res.clearCookie("RefreshToken", { httpOnly: true });
                res.status(httpStatusCode_1.default.OK).json('Logged out successfully');
            }
            catch (error) {
                console.log("User:= logout error", error);
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later");
            }
            ;
        };
        this.userService = userService;
    }
    ;
}
;
exports.default = UserController;
