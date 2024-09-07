import { IBookingDetails, IBookingHistory, IFeedbackRepository, IRatingReview, ISlot, ITechnicianDetails } from "./common.interface";

export interface ITechnicianRepository {
   createTechnician(technicianData: ITechnicianDetails): Promise<ITechnicianDetails>;
   updateProfession(userId: string, profession: string): Promise<boolean>;
   updateAvailableStatus(userId: string, isAvailable: boolean): Promise<boolean>;
   getBookings(userId: string): Promise<IBookingHistory[]>;
   getBookingDetails(bookingId: string): Promise<IBookingDetails>;
   getTechnicianInfo(userId: string): Promise<ITechnicianDetails | null>;
   updateBookingStatus(bookingId: string, status: string): Promise<boolean>;
   updateAvailableSlots(technicianId: string, slots: ISlot[]): Promise<boolean>;
   completeBooking(bookingId: string, laborCharge: string, completionDate: string): Promise<boolean>;
   deleteNotification(userId: string): Promise<boolean>;
   bookSlot(userId: string, date: string): Promise<boolean>;
   cancelBookingSlot(userId: string, date: string): Promise<boolean>;
   addNotification(userId: string, notification: string): Promise<boolean>;
   createRating(ratingDetails: IRatingReview): Promise<IRatingReview>;
   getTechnicianFeedbacks(technicianId: string): Promise<IFeedbackRepository | null>;
   updateTechnicianRating(technicianId: string, newRating: number): Promise<boolean>;
   getRatingWithReviewerDetails(userId: string): Promise<IFeedbackRepository>;
};