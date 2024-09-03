import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config();

const database_connection = async (): Promise<void> => {
   try {
      await mongoose.connect(process.env.MONGO_URL as string);
      console.log("Database connected");
   } catch (error) {
      console.log("Database is not connected", error);
   }
}

export default database_connection;