import { IBookingDetails, IBookingHistory, IFeedbackRepository, ISlot, ITechnicianDetails, IWallet } from "./common.interface";

export interface ITechnicianService {
   createTechnician(user_id: string, profession: string): Promise<ITechnicianDetails>;
   updateProfession(user_id: string, profession: string): Promise<boolean>;
   updateAvailableStatus(user_id: string, newStatus: string | boolean): Promise<boolean>;
   getBookings(technicianUserID: string): Promise<IBookingHistory[]>;
   getBookingDetails(bookingId: string): Promise<IBookingDetails>;
   getTechnicianInfo(userId: string): Promise<ITechnicianDetails | null>;
   deleteNotification(userId: string): Promise<boolean>;
   updateBookingStatus(booking_id: string, newStatus: string, technician_id: string, serviceDate: string): Promise<boolean>;
   completeBooking(booking_id: string, client_id: string, laborCharge: string): Promise<boolean>;
   updateAvailableSlots(technicianId: string, slots: ISlot[]): Promise<boolean>;
   getRatingWithReviewerDetails(userId: string): Promise<IFeedbackRepository>;
   getWallet(user_id: string): Promise<IWallet | null>;
};