import { userModel } from "../Model/userModal";

class AdminRepository {

   async fetchUserRepository() {
      try {
         return await userModel.find({});
      } catch (error) {
         console.log("Error from database : ", error);
         throw error;
      }
   }

   async unblockUserRepository(user_id: string) {
      try {
         return await userModel.updateOne({ user_id }, { isBlocked: false });
      } catch (error) {
         console.log("Error from database:", error);
         throw error;
      }
   }

   async blockUserRepository(user_id: string) {
      try {
         return await userModel.updateOne({ user_id }, { isBlocked: true });
      } catch (error) {
         console.log("Error from database:", error);
         throw error;
      }
   }

}

export default AdminRepository;