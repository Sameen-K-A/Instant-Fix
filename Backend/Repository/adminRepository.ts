import User from "../Model/userModal";

class AdminRepository {

   async fetchUserRepository() {
      try {
         return await User.find({}).sort({ _id: -1 });
      } catch (error) {
         console.log("Error from database : ", error);
         throw error;
      }
   };

   async unblockUserRepository(user_id: string) {
      try {
         return await User.updateOne({ user_id }, { isBlocked: false });
      } catch (error) {
         console.log("Error from database:", error);
         throw error;
      }
   };

   async blockUserRepository(user_id: string) {
      try {
         return await User.updateOne({ user_id }, { isBlocked: true });
      } catch (error) {
         console.log("Error from database:", error);
         throw error;
      }
   };

   async fetchTechnicianRepository() {
      try {
         return await User.aggregate([
            { $match: { isTechnician: true } },
            { $lookup: { from: "technicians", localField: "user_id", foreignField: "user_id", as: "technicianDetails" } },
            { $sort: { _id: -1 } },
         ]);
      } catch (error) {
         console.log("Fetch technician repository error : ", error);
         throw error;
      }
   };

}

export default AdminRepository;