import { technicianModel, technicianType } from "../Model/technicianModel";

class TechnicianRepository {

  async joinNewTechnicianRepository(technicianData: technicianType) {
    try {
      return await technicianModel.create(technicianData);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  async changeProfessionRepository(user_id: string, profession: string) {
    try {
      return await technicianModel.updateOne({ user_id: user_id }, { $set: { profession: profession } });
    } catch (error) {
      throw error;
    }
  };

}

export default TechnicianRepository;