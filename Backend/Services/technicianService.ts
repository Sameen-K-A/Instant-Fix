import { v4 as uuid } from "uuid";
import UserRepository from "../Repository/userRepository";
import WalletRepository from "../Repository/WalletRepository";
import sendConfirmBookingmail from "../Config/BookingConfirmEmail";
import { ISlotType, ITechnicianDetails, ITechnicianService, IRatingReviewType, IFeedbackRepository, IBookingHistory, IBookingDetails, ITechnicianRepository } from "../Interfaces/techinicianInterfaces";
import { WalletType } from "../interfaces";

class TechnicianService implements ITechnicianService {
   
   private technicianRepository: ITechnicianRepository;
   private userRepository: UserRepository;
   private walletRepository: WalletRepository;

   constructor(technicianRepository: ITechnicianRepository) {
      this.technicianRepository = technicianRepository;
      this.userRepository = new UserRepository();
      this.walletRepository = new WalletRepository();
   }

   async createTechnician(user_id: string, profession: string): Promise<ITechnicianDetails> {
      try {
         const technicianData: ITechnicianDetails = {
            user_id: user_id,
            rating: 0,
            technician_id: uuid(),
            profession: profession,
         };
         const { modifiedCount } = await this.userRepository.accessIsTechnician(user_id);
         if (modifiedCount !== 1) {
            throw new Error("Failed to update user to technician");
         };
         const technicianWallet: WalletType = {
            user_id: user_id,
            balanceAmount: 0,
            transactions: [],
         };
         const ratingDetails: IRatingReviewType = {
            user_id: user_id,
            reviews: [],
         };
         const [technicianResponse, walletResponse] = await Promise.all([
            this.technicianRepository.createTechnician(technicianData),
            this.walletRepository.addNewWalletForTechnicianRepository(technicianWallet),
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

   async updateTechnicianProfession(user_id: string, profession: string): Promise<boolean> {
      try {
         return await this.technicianRepository.updateTechnicianProfession(user_id, profession);
      } catch (error) {
         throw error;
      };
   };

   async updateTechnicianAvailability(user_id: string, newStatus: string | boolean): Promise<boolean> {
      try {
         newStatus = newStatus === "Active" ? true : false;
         return await this.technicianRepository.updateTechnicianAvailability(user_id, newStatus);
      } catch (error) {
         throw error;
      };
   };

   async getTechnicianInfo(userId: string): Promise<ITechnicianDetails | null> {
      try {
         return await this.technicianRepository.getTechnicianInfo(userId);
      } catch (error) {
         throw error;
      };
   };

   async getTechnicianBookingHistory(technicianUserID: string): Promise<IBookingHistory[]> {
      try {
         console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")
         return await this.technicianRepository.getTechnicianBookingHistory(technicianUserID);
      } catch (error) {
         throw error;
      };
   };

   async getBookingDetails(bookingId: string): Promise<IBookingDetails> {
      try {
         return await this.technicianRepository.getBookingDetails(bookingId);
      } catch (error) {
         throw error;
      };
   };

   async clearTechnicianNotifications(userId: string): Promise<boolean> {
      try {
         return await this.technicianRepository.clearTechnicianNotifications(userId);
      } catch (error) {
         throw error;
      };
   };

   async updateBookingStatus(bookingId: string, newStatus: string, technicianId: string, serviceDate: string): Promise<boolean> {
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

   async completeBooking(bookingId: string, clientId: string, laborCharge: string): Promise<boolean> {
      try {
         const clientDetails = await this.userRepository.findUserByUser_id(clientId);
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

   async updateAvailableSlots(technicianId: string, slots: ISlotType[]): Promise<boolean> {
      try {
         return await this.technicianRepository.updateAvailableSlots(technicianId, slots);
      } catch (error) {
         throw error;
      };
   };

   async fetchWalletInformationService(user_id: string): Promise<any> {
      try {
         return this.walletRepository.fetchWalletDetails(user_id);
      } catch (error) {
         throw error;
      };
   };

   async getRatingWithReviewerDetails(userId: string): Promise<IFeedbackRepository> {
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