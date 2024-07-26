import { technicianModel, technicianType } from "../Model/technicianModel";

class TechnicianRepository {

   async joinNewTechnicianRepository(technicianData: technicianType) {
      try {
         return await technicianModel.create(technicianData);
      } catch (error) {
         console.error(error);
         throw error;
      }
   }

}

export default TechnicianRepository;