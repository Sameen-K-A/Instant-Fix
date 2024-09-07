import mongoose from "mongoose";

export interface IUser {
   _id?: mongoose.Types.ObjectId;
   user_id?: string;
   name: string;
   email: string;
   phone: string;
   password?: string;
   isBlocked?: boolean;
   profileIMG: string;
   isTechnician?: boolean;
   addressDetails?: null | IUserAddress;
   alreadychattedtechnician?: string[];
   savedTechnicians?: string[];
};

export interface IUserAddress {
   name?: string;
   address: string;
   district: string;
   state: string;
   pincode: string;
   phone: string;
   alternatePhone: string;
   location?: {
      type: "Point";
      coordinates: [number, number];
   };
};

export interface IBookingDetails {
   _id?: mongoose.Types.ObjectId;
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
   serviceLocation: IUserAddress;
   reviewAdded?: boolean;
   userDetails?: IUser;
};

export interface IBookingHistory extends Pick<IBookingDetails, "booking_id" | "booking_status" | "bookingTime" | "bookingDate" | "serviceDate"> {
   userDetails: Pick<IUser, "name">;
};

export interface ITechnicianDetails {
   _id?: mongoose.Types.ObjectId;
   user_id?: string;
   technician_id?: string;
   profession?: string;
   availability?: boolean;
   rating?: number;
   notifications?: string[];
   availableSlots?: ISlot[];
};

export interface ISlot {
   slotDate: string;
   slotBooked: boolean;
};

export type ISingleRating = {
   rated_user_id: string;
   starCount: number;
   review: string;
   date: string;
};

export type IRatingReview = {
   user_id: string;
   reviews: ISingleRating[];
};

export interface IFeedbackRepository {
   reviewerDetails?: IReviewerDetail[];
   reviews: IReview[];
   technicianRating: {
      rating: number;
   };
};

export interface IReview {
   reviewerName?: string;
   reviewerProfileIMG?: string;
   rated_user_id: string;
   starCount: number;
   review: string;
   date: string;
};

export interface IReviewerDetail {
   user_id: string;
   name: string;
   profileIMG: string;
};

export interface IUserWithITechnician extends IUser {
   technicianDetails: ITechnicianDetails;
   ratingInformation?: {
      reviews: IReview[];
   };
   reviewerDetails?: IReviewerDetail[];
};

export interface IFollowedTechnician {
   SavedTechnicianPersonalInformation: Pick<IUser, "user_id" | "name" | "profileIMG">;
   SavedTechnicianProfessionInformation: {
      profession: Pick<ITechnicianDetails, "profession">
   };
};

export interface ITechnicians extends Pick<IUser, "name" | "user_id" | "profileIMG"> {
   technicianDetails: Pick<ITechnicianDetails, "profession" | "availability" | "rating">
};

export interface IWallet {
   _id?: string;
   user_id: string;
   balanceAmount: number;
   transactions: ITransaction[];
};

export interface ITransaction {
   amount: number;
   dateTime: string;
   transactionStatus: "Debit" | "Credit";
};

export interface IChat {
   _id?: mongoose.Types.ObjectId;
   chatMembers?: string[];
   details: {
      senderID: string;
      receiverID: string;
      message: string;
      time?: Date;
   }[];
};

export interface IChatMessage {
   senderID: string,
   receiverID: string,
   message: string,
   time?: string;
};