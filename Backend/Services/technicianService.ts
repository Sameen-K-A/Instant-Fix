import { v4 as uuid } from "uuid";
import { technicianType } from "../Model/technicianModel"
import TechnicianRepository from "../Repository/technicianRepository";
import UserRepository from "../Repository/userRepository";

class TechnicianService {
   private technicianRepository: TechnicianRepository;
   private userRepository: UserRepository;

   constructor() {
      this.technicianRepository = new TechnicianRepository();
      this.userRepository = new UserRepository();
   }

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
   }

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
      }
   }

   async changeAvailabilityStatusService(user_id: string, newStatus: string | boolean) {
      try {
         if (newStatus === "Active") {
            newStatus = true;
         } else {
            newStatus = false;
         }
         return await this.technicianRepository.changeAvailabilityStatusRepository(user_id, newStatus);
      } catch (error) {
         throw error;
      }
   }
}

export default TechnicianService;