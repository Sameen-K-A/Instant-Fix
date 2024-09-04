import { Document, UpdateWriteOpResult } from "mongoose";

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
   booking_id: string;
   client_id: string;
   technicianUser_id: string;
   booking_status: "Requested" | "Rejected" | "Pending" | "Completed" | "Cancelled";
   Booking_profession: string;
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

export interface ITechnicianDetails extends Document {
   _id?: string;
   user_id: string;
   technician_id: string;
   profession: string;
   availability: boolean;
   rating: number;
   notifications: string[];
   availableSlots: ISlotType[];
}

export interface IFeedbackRepository {
   reviewerDetails: IReviewerDetail[];
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
   createTechnicianRepository(technicianData: ITechnicianDetails): Promise<ITechnicianDetails>;
   changeProfessionRepository(user_id: string, profession: string): Promise<UpdateWriteOpResult>;
   changeAvailabilityStatusRepository(user_id: string, newStatus: boolean): Promise<UpdateWriteOpResult>;
   fetchTechnicianBookingHistoryRepository(technicianUserID: string): Promise<IBookingHistory[]>;
   fetchTechnicianInformationRepository(technicianUser_id: string): Promise<ITechnicianDetails | null>;
   fetchingIndividualBookingDetailsRepository(booking_id: string): Promise<IBookingDetails>;
   acceptRejectCancelNewBookingRepository(booking_id: string, status: string): Promise<UpdateWriteOpResult>;
   modifyAvailableSlotsRepository(technician_id: string, availableSlots: ISlotType[]): Promise<UpdateWriteOpResult>;
   completeBookingRepository(booking_id: string, laborCharge: string, completeDate: string): Promise<UpdateWriteOpResult>;
   clearNotificationRepository(technicianUser_id: string): Promise<UpdateWriteOpResult>;
   changeTechncianSlotAfterBookingRepository(technicianUser_id: string, selectedDate: string): Promise<UpdateWriteOpResult>;
   changeTechncianSlotAfterBookingCancelRepository(technicianUser_id: string, selectedDate: string): Promise<UpdateWriteOpResult>;
   addNewNotificationRepository(technicianUser_id: string, notification: string): Promise<UpdateWriteOpResult>;
   createRatingDetailsRepository(ratingDetails: IRatingReviewType): Promise<IRatingReviewType>;
   fetchAllFeedbacksRepository(technician_id: string): Promise<IFeedbackRepository | null>;
   updateNewAvgRatingToTechnicianRepository(technician_id: string, newRating: number): Promise<UpdateWriteOpResult>;
   fetchningRatingWithReviewerDetailsRepository(technicianUser_id: string): Promise<IFeedbackRepository>;
}