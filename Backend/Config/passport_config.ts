import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../Model/userModal";
import Booking from "../Model/bookingModel";
import Rating from "../Model/reviewModal";
import UserRepository from "../Repository/userRepository";
import { IUser } from "../Interfaces/common.interface";
import { createRefreshToken, createToken } from "./jwt_config";

dotenv.config();
const userRepository = new UserRepository(User, Booking, Rating);

passport.use(new GoogleStrategy(
   {
      clientID: process.env.Google_clientID as string,
      clientSecret: process.env.Google_Secret as string,
      callbackURL: '/auth/google/callback',
   },
   async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
      try {
         const email = profile.emails![0].value;
         const userDetails: IUser | null = await userRepository.login(email);
         if (userDetails) {
            const userToken: string = createToken(userDetails.user_id as string);
            const userRefreshToken: string = createRefreshToken(userDetails.user_id as string);
            return done(null, { userDetails, userToken, userRefreshToken });
         } else {
            console.log("User does not exist");
            return done(null, { message: 'User does not exist' });
         }
      } catch (error) {
         console.log("Error during Google login: ", error);
         return done(error);
      }
   }
));

export default passport;