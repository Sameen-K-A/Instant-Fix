import User from "../Model/userModal";
import Booking from "../Model/bookingModel";
import Rating from "../Model/reviewModal";
import { Request, Response, NextFunction } from "express";
import UserRepository from "../Repository/userRepository";
import HTTP_statusCode from "../Enums/httpStatusCode";

const userRepository = new UserRepository(User, Booking, Rating);

async function isBloked(req: Request, res: Response, next: NextFunction) {
   try {
      const user_id = req.user_id;
      if (!user_id) {
         return res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. User ID not found.' });
      };
      const isBlocked = await userRepository.userIsBlocked(user_id);
      console.log("user is blocked => ", isBlocked)
      if (isBlocked === true) {
         return res.status(HTTP_statusCode.Unauthorized).json({ message: 'Access denied. User is blocked.' });
      }
      next();
   } catch (error) {
      return res.status(HTTP_statusCode.InternalServerError).json({ message: 'Server error.' });
   }
}

export default isBloked;