import { Orders } from "razorpay/dist/types/orders";
import { IBookingDetails, IBookingHistory, IFollowedTechnician, IReviewerDetail, ITechnicians, IUser, IUserAddress, IUserWithITechnician } from "./common.interface";

export interface IUserService {
   login(email: string, password: string): Promise<{ userData: IUserWithITechnician; userToken: string; userRefreshToken: string }>;
   register(userData: IUser): Promise<void>;
   otpVerification(enteredOTP: string): Promise<IUser>;
   resendOTP(): Promise<void>;
   createUpdateAddress(addressData: IUserAddress, user_id: string): Promise<boolean>;
   deleteAddress(user_id: string): Promise<boolean>;
   updatePassword(user_id: string, currentPass: string, newPass: string): Promise<boolean>;
   updateProfile(user_id: string, name: string, phone: string, profileIMG: string | null): Promise<boolean>;
   getPreSignedURL(imageName: string): Promise<string>;
   getTechnicians(user_id: string): Promise<ITechnicians[]>;
   getTechnicianWithPersonalDetails(technicianUser_id: string): Promise<IUserWithITechnician>;
   followTechnician(user_id: string, technicianUser_id: string): Promise<boolean>;
   unfollowTechnician(user_id: string, technicianUser_id: string): Promise<boolean>;
   getFollowedTechnicians(user_id: string): Promise<IFollowedTechnician[]>;
   getChatFriends(user_id: string): Promise<IReviewerDetail[]>;
   bookTechnician(client_id: string, client_name: string, technicianDetails: any, serviceLocation: IUserAddress, selectedDate: string): Promise<IBookingDetails>;
   getBookingsHistory(user_id: string): Promise<IBookingHistory[]>;
   getBookingDetails(bookingId: string): Promise<IBookingDetails>;
   cancelBooking(booking_id: string, technician_id: string, userName: string, serviceDate: string): Promise<boolean>;
   proceedToPayment(booking_id: string, laborCost: string): Promise<Orders.RazorpayOrder>;
   verifyPayment(payment_id: string, order_id: string, signature: string, booking_id: string, amount: string, technicianUser_id: string): Promise<boolean>;
   submitReview(user_id: string, technicianUser_id: string, enteredRating: number, enteredFeedback: string, booking_id: string): Promise<boolean>;
};