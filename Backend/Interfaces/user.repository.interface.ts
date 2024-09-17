import { IBookingDetails, IBookingHistory, IFollowedTechnician, IReviewerDetail, ISingleRating, ITechnicians, IUser, IUserAddress, IUserWithITechnician } from "./common.interface";

export interface IUserRepository {
   findByEmail(email: string): Promise<IUser | null>;
   findByUser_id(user_id: string): Promise<IUser | null>;
   login(email: string): Promise<IUserWithITechnician>;
   register(userData: IUser): Promise<IUser>;
   createUpdateAddress(addressData: IUserAddress, user_id: string): Promise<boolean>;
   deleteAddress(user_id: string): Promise<boolean>;
   accessIsTechnician(user_id: string): Promise<boolean>;
   updatePassword(user_id: string, hashedNewPassword: string): Promise<boolean>;
   updateProfileDetails(user_id: string, updatedInformation: { name: string, phone: string }): Promise<boolean>;
   updateProfileImage(user_id: string, imageName: string): Promise<boolean>;
   followTechnician(user_id: string, technicianUser_id: string): Promise<boolean>;
   unfollowTechnician(user_id: string, technicianUser_id: string): Promise<boolean>;
   getFollowedTechnicians(user_id: string): Promise<IFollowedTechnician[]>;
   getTechnicians(user_id: string): Promise<ITechnicians[]>;
   getTechnicianWithPersonalDetails(technicianUser_id: string): Promise<IUserWithITechnician>;
   getTechnicianDetails(technicianUserID: string): Promise<IUserWithITechnician>;
   getChatFriends(user_id: string): Promise<IReviewerDetail[]>;
   createConnectionToChatFriends(user_id: string, technicianUser_id: string): Promise<boolean>;
   bookTechnician(bookingDetails: IBookingDetails): Promise<IBookingDetails>;
   getBookingsHistory(user_id: string): Promise<IBookingHistory[]>;
   getBookingDetails(bookingId: string): Promise<IBookingDetails>;
   cancelBooking(booking_id: string): Promise<boolean>;
   updateBookingPaymentStatus(booking_id: string, Payment_Status: string): Promise<boolean>;
   updateBookingReviewAdded(booking_id: string, reviewAdded: boolean): Promise<boolean>;
   addNewFeedbackToTechnician(technician_id: string, feedbackInformation: ISingleRating): Promise<boolean>;
};