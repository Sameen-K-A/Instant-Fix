import { v4 as uuid } from "uuid";
import sendConfirmBookingmail from "../Config/BookingConfirmEmail";
import { ITechnicianService } from "../Interfaces/technician.service.interface";
import { ITechnicianRepository } from "../Interfaces/technician.repository.interface";
import { IUserRepository } from "../Interfaces/user.repository.interface";
import { IWalletRepository } from "../Interfaces/wallet.repository.interface";
import { IBookingDetails, IBookingHistory, IFeedbackRepository, IRatingReview, ISlot, ITechnicianDetails, IWallet } from "../Interfaces/common.interface";

class TechnicianService implements ITechnicianService {

   private technicianRepository: ITechnicianRepository;
   private userRepository: IUserRepository;
   private walletRepository: IWalletRepository;

   constructor(technicianRepository: ITechnicianRepository, walletRepository: IWalletRepository, userRepository: IUserRepository) {
      this.technicianRepository = technicianRepository;
      this.walletRepository = walletRepository;
      this.userRepository = userRepository;
   }

   createTechnician = async (user_id: string, profession: string): Promise<ITechnicianDetails> => {
      try {
         const technicianData: ITechnicianDetails = {
            user_id: user_id,
            rating: 0,
            technician_id: uuid(),
            profession: profession,
         };
         const response = await this.userRepository.accessIsTechnician(user_id);
         if (!response) {
            throw new Error("Failed to update user to technician");
         };
         const technicianWallet: IWallet = {
            user_id: user_id,
            balanceAmount: 0,
            transactions: [],
         };
         const ratingDetails: IRatingReview = {
            user_id: user_id,
            reviews: [],
         };
         const [technicianResponse, walletResponse] = await Promise.all([
            this.technicianRepository.createTechnician(technicianData),
            this.walletRepository.createWallet(technicianWallet),
            this.technicianRepository.createRating(ratingDetails),
         ]);
         if (!technicianResponse || !walletResponse) {
            throw new Error("Failed to create technician.");
         };
         return technicianResponse;
      } catch (error) {
         throw error;
      };
   };

   updateProfession = async (user_id: string, profession: string): Promise<boolean> => {
      try {
         return await this.technicianRepository.updateProfession(user_id, profession);
      } catch (error) {
         throw error;
      };
   };

   updateAvailableStatus = async (user_id: string, newStatus: string | boolean): Promise<boolean> => {
      try {
         newStatus = newStatus === "Active" ? true : false;
         return await this.technicianRepository.updateAvailableStatus(user_id, newStatus);
      } catch (error) {
         throw error;
      };
   };

   getTechnicianInfo = async (userId: string): Promise<ITechnicianDetails | null> => {
      try {
         return await this.technicianRepository.getTechnicianInfo(userId);
      } catch (error) {
         throw error;
      };
   };

   getBookings = async (technicianUserID: string): Promise<IBookingHistory[]> => {
      try {
         return await this.technicianRepository.getBookings(technicianUserID);
      } catch (error) {
         throw error;
      };
   };

   getBookingDetails = async (bookingId: string): Promise<IBookingDetails> => {
      try {
         return await this.technicianRepository.getBookingDetails(bookingId);
      } catch (error) {
         throw error;
      };
   };

   deleteNotification = async (userId: string): Promise<boolean> => {
      try {
         return await this.technicianRepository.deleteNotification(userId);
      } catch (error) {
         throw error;
      };
   };

   updateBookingStatus = async (bookingId: string, newStatus: string, technicianId: string, serviceDate: string): Promise<boolean> => {
      try {
         const status = newStatus === "Accept" ? "Pending" : (newStatus === "Reject" ? "Rejected" : "Cancelled");
         await this.technicianRepository.updateBookingStatus(bookingId, status);
         if (status === "Rejected" || status === "Cancelled") {
            await this.technicianRepository.cancelBookingSlot(technicianId, serviceDate);
         };
         return true;
      } catch (error) {
         throw error;
      };
   };

   completeBooking = async (bookingId: string, clientId: string, laborCharge: string): Promise<boolean> => {
      try {
         const clientDetails = await this.userRepository.findByUser_id(clientId);
         if (!clientDetails) {
            throw new Error("Client details not found.");
         };
         const completedDate = new Date().toLocaleDateString('en-CA');
         const [emailResponse] = await Promise.all([
            sendConfirmBookingmail(clientDetails.email, laborCharge, bookingId),
            this.technicianRepository.completeBooking(bookingId, laborCharge, completedDate),
         ]);
         if (!emailResponse) {
            throw new Error("Failed to complete booking.");
         };
         return true;
      } catch (error) {
         throw error;
      };
   };

   updateAvailableSlots = async (technicianId: string, slots: ISlot[]): Promise<boolean> => {
      try {
         return await this.technicianRepository.updateAvailableSlots(technicianId, slots);
      } catch (error) {
         throw error;
      };
   };

   getWallet = async (user_id: string): Promise<IWallet | null> => {
      try {
         return this.walletRepository.getWallet(user_id);
      } catch (error) {
         throw error;
      };
   };

   getRatingWithReviewerDetails = async (userId: string): Promise<IFeedbackRepository> => {
      try {
         const result = await this.technicianRepository.getRatingWithReviewerDetails(userId);
         result.reviews = result.reviews.map(review => {
            const reviewer = result.reviewerDetails?.find(reviewer => reviewer.user_id === review.rated_user_id);
            return { ...review, reviewerName: reviewer?.name, reviewerProfileIMG: reviewer?.profileIMG, };
         });
         delete result.reviewerDetails;
         return result;
      } catch (error) {
         throw error;
      }
   };

};

export default TechnicianService;