export interface ISlotType {
   slotDate: string;
   slotBooked: boolean;
}

export type ISingleRatingType = {
   rated_user_id: string;
   starCount: number;
   review: string;
   date: string;
}

export type IRatingReviewType = {
   user_id: string;
   reviews: ISingleRatingType[];
}

export interface IBookingDetails {
   _id?: string;
   booking_id: string;
   client_id: string;
   technicianUser_id: string;
   booking_status: "Requested" | "Rejected" | "Pending" | "Completed" | "Cancelled";
   booking_profession: string;
   bookingTime: string;
   bookingDate: string;
   serviceDate: string;
   serviceCompletedDate: "Pending" | string;
   serviceCost: string;
   payment_status: "Pending" | "Completed" | "Requested";
   serviceLocation: IServiceLocation;
   reviewAdded: boolean;
   userDetails: IUserDetails;
}

export interface IUserDetails {
   name: string;
   email: string;
   phone: string;
}

export interface IServiceLocation {
   address: string;
   district: string;
   state: string;
   phone: string;
   alternatePhone: string;
   pincode: string;
   location: {
      type: "Point";
      coordinates: [number, number];
   };
}

export interface IBookingHistory extends Pick<IBookingDetails, "booking_id" | "booking_status" | "bookingTime" | "bookingDate" | "serviceDate"> {
   userDetails: Pick<IUserDetails, "name">;
}

export interface ITechnicianDetails  {
   _id?: string;
   user_id: string;
   technician_id: string;
   profession: string;
   availability?: boolean;
   rating?: number;
   notifications?: string[];
   availableSlots?: ISlotType[];
}

export interface IFeedbackRepository {
   reviewerDetails?: IReviewerDetail[];
   reviews: IReview[];
   technicianRating: {
      rating: number;
   };
}

export interface IReview {
   rated_user_id: string;
   starCount: number;
   review: string;
   date: string;
}

export interface IReviewerDetail {
   user_id: string;
   name: string;
   profileIMG: string;
}

export interface ITechnicianRepository {
   createTechnician(technicianData: ITechnicianDetails): Promise<ITechnicianDetails>;
   updateTechnicianProfession(userId: string, profession: string): Promise<boolean>;
   updateTechnicianAvailability(userId: string, isAvailable: boolean): Promise<boolean>;
   getTechnicianBookingHistory(userId: string): Promise<IBookingHistory[]>;
   getTechnicianInfo(userId: string): Promise<ITechnicianDetails | null>;
   getBookingDetails(bookingId: string): Promise<IBookingDetails>;
   updateBookingStatus(bookingId: string, status: string): Promise<boolean>;
   updateAvailableSlots(technicianId: string, slots: ISlotType[]): Promise<boolean>;
   completeBooking(bookingId: string, laborCharge: string, completionDate: string): Promise<boolean>;
   clearTechnicianNotifications(userId: string): Promise<boolean>;
   bookSlot(userId: string, date: string): Promise<boolean>;
   cancelBookingSlot(userId: string, date: string): Promise<boolean>;
   addNotification(userId: string, notification: string): Promise<boolean>;
   createRating(ratingDetails: IRatingReviewType): Promise<IRatingReviewType>;
   getTechnicianFeedbacks(technicianId: string): Promise<IFeedbackRepository | null>;
   updateTechnicianRating(technicianId: string, newRating: number): Promise<boolean>;
   getRatingWithReviewerDetails(userId: string): Promise<IFeedbackRepository>;
};

export interface ITechnicianService {
   createTechnician(user_id: string, profession: string): Promise<ITechnicianDetails>;
   updateTechnicianProfession(user_id: string, profession: string): Promise<boolean>;
   updateTechnicianAvailability(user_id: string, newStatus: string | boolean): Promise<boolean>;
   getTechnicianBookingHistory(technicianUserID: string): Promise<IBookingHistory[]>;
   getBookingDetails(bookingId: string): Promise<IBookingDetails>;
   getTechnicianInfo(userId: string): Promise<ITechnicianDetails | null>;
   clearTechnicianNotifications(userId: string): Promise<boolean>;
   updateBookingStatus(booking_id: string, newStatus: string, technician_id: string, serviceDate: string): Promise<boolean>;
   completeBooking(booking_id: string, client_id: string, laborCharge: string): Promise<boolean>;
   updateAvailableSlots(technicianId: string, slots: ISlotType[]): Promise<boolean>;
   getRatingWithReviewerDetails(userId: string): Promise<IFeedbackRepository>;
   fetchWalletInformationService(user_id: string): Promise<any>;
};