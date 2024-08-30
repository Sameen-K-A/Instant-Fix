import { v4 as uuid } from "uuid";
import { technicianType } from "../Model/technicianModel"
import TechnicianRepository from "../Repository/technicianRepository";
import UserRepository from "../Repository/userRepository";
import { slotType } from "../Interfaces";
import sendConfirmBookingmail from "../Config/BookingConfirmEmail";

class TechnicianService {
   private technicianRepository: TechnicianRepository;
   private userRepository: UserRepository;

   constructor() {
      this.technicianRepository = new TechnicianRepository();
      this.userRepository = new UserRepository();
   };

   async joinNewTechnicianService(user_id: string, profession: string) {
      try {
         const technicianData: technicianType = {
            user_id: user_id,
            technician_id: uuid(),
            profession: profession,
         };
         const userRepository_Response = await this.userRepository.accessIsTechnician(user_id);
         if (userRepository_Response.modifiedCount === 1) {
            const technicianRepository_Response = await this.technicianRepository.joinNewTechnicianRepository(technicianData);
            if (technicianRepository_Response) {
               return technicianRepository_Response;
            } else {
               throw new Error('Failed to create technician');
            }
         } else {
            throw new Error('Failed to update user to technician');
         }
      } catch (error) {
         console.log("error form service : ", error);
         throw error;
      }
   };

   async changeProfessionService(user_id: string, profession: string): Promise<boolean> {
      try {
         const response = await this.technicianRepository.changeProfessionRepository(user_id, profession);
         if (response.modifiedCount === 1) {
            return true;
         } else {
            throw new Error("No changes found");
         }
      } catch (error) {
         throw error;
      };
   };

   async changeAvailabilityStatusService(user_id: string, newStatus: string | boolean) {
      try {
         if (newStatus === "Active") {
            newStatus = true;
         } else {
            newStatus = false;
         };
         return await this.technicianRepository.changeAvailabilityStatusRepository(user_id, newStatus);
      } catch (error) {
         throw error;
      };
   };

   async fetchTechnicianInformationService(technicianUser_id: string) {
      try {
         return await this.technicianRepository.fetchTechnicianInformationRepository(technicianUser_id);
      } catch (error) {
         throw error;
      };
   };

   async fetchTechnicianBookingHistoryService(technicianUserID: string) {
      try {
         return await this.technicianRepository.fetchTechnicianBookingHistoryRepository(technicianUserID);
      } catch (error) {
         throw error;
      };
   };

   async fetchingIndividualBookingDetailsService(booking_id: string) {
      try {
         return await this.technicianRepository.fetchingIndividualBookingDetailsRepository(booking_id);
      } catch (error) {
         throw error;
      }
   };

   async clearNotificationService(technicianUser_id: string) {
      try {
         const response = await this.technicianRepository.clearNotificationRepository(technicianUser_id);
         if (response.modifiedCount === 0) {
            throw new Error("Can't clear notifications.");
         };
         return;
      } catch (error) {
         throw error;
      };
   };

   async acceptRejectCancelNewBookingService(booking_id: string, newStatus: string, technician_id: string, serviceDate: string): Promise<boolean> {
      try {
         let status: string = newStatus === "Accept" ? "Pending" : (newStatus === "Reject" ? "Rejected" : "Cancelled");
         const response = await this.technicianRepository.acceptRejectCancelNewBookingRepository(booking_id, status);
         if (response.modifiedCount === 0) {
            throw new Error("Status is not changed");
         };
         if (status === "Rejected" || status === "Cancelled") {
            await this.technicianRepository.changeTechncianSlotAfterBookingCancelRepository(technician_id, serviceDate);
         };
         return true;
      } catch (error) {
         throw error;
      };
   };

   async completeBookingService(booking_id: string, client_id: string, laborCharge: string) {
      try {
         const clientDetails = await this.userRepository.findUserByUser_id(client_id);
         if (clientDetails) {
            const completedDate = new Date().toLocaleDateString('en-CA');
            const [sendEmail, changeBookingDetails] = await Promise.all([
               sendConfirmBookingmail(clientDetails.email, laborCharge, booking_id),
               this.technicianRepository.completeBookingRepository(booking_id, laborCharge, completedDate),
            ]);
            if (!sendEmail) throw new Error("Email not sended");
            if (changeBookingDetails.modifiedCount !== 1) throw new Error("Booking details is not changed");
         } else {
            throw new Error("Can't find the client details");
         };
      } catch (error) {
         throw error;
      };
   };

   async modifyAvailableSlotsService(technician_id: string, slots: slotType[]) {
      try {
         const result = await this.technicianRepository.modifyAvailableSlotsRepository(technician_id, slots);
         if (result.modifiedCount === 0) {
            throw new Error("Slot modification is failed.");
         };
         return true;
      } catch (error) {
         throw error;
      };
   };

};

export default TechnicianService;