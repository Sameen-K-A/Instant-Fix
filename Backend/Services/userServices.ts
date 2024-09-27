import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";
import sendOTPmail from "../Config/email_config";
import { createToken, createRefreshToken } from "../Config/jwt_config";
import { io } from "../Config/socket_config";
import axios from "axios";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import { IBookingDetails, IBookingHistory, IFeedbackRepository, IFollowedTechnician, IReview, IReviewerDetail, ISingleRating, ITechnicians, ITransaction, IUser, IUserAddress, IUserWithITechnician } from "../Interfaces/common.interface";
import { IUserService } from "../Interfaces/user.service.interface";
import { IUserRepository } from "../Interfaces/user.repository.interface";
import { ITechnicianRepository } from "../Interfaces/technician.repository.interface";
import { Orders } from "razorpay/dist/types/orders";
import { IWalletRepository } from "../Interfaces/wallet.repository.interface";
import { generateGetPreSignedURL, generatePutPreSignedURL } from '../Config/s3_config';
import { OAuth2Client } from "google-auth-library";
dotenv.config();
const client = new OAuth2Client(`${process.env.Google_clientID}`);

class UserServices implements IUserService {
   private userRepository: IUserRepository;
   private technicianRepository: ITechnicianRepository;
   private walletRepository: IWalletRepository;
   private OTP: string | null = null;
   private expiryOTP_time: Date | null = null;
   private userData: IUser | null = null;

   constructor(userRepository: IUserRepository, technicianRepository: ITechnicianRepository, walletRepository: IWalletRepository) {
      this.userRepository = userRepository;
      this.technicianRepository = technicianRepository;
      this.walletRepository = walletRepository;
   };

   login = async (email: string, password: string): Promise<{ userData: IUserWithITechnician; userToken: string; userRefreshToken: string }> => {
      try {
         let userData = await this.userRepository.login(email);
         if (!userData) throw new Error("email not found");
         const comparePassword = await bcrypt.compare(password, userData.password as string);
         if (!comparePassword) throw new Error("Wrong password");
         if (userData.isBlocked) throw new Error("User is blocked");
         const userToken = createToken(userData.user_id as string, process.env.userRole as string);
         const userRefreshToken = createRefreshToken(userData.user_id as string, process.env.userRole as string);
         const profileImageS3_bucketURl = await generateGetPreSignedURL(userData.profileIMG as string);
         userData = { ...userData, password: "", profileIMG: profileImageS3_bucketURl };
         return { userData, userToken, userRefreshToken };
      } catch (error) {
         throw error;
      };
   };

   verifyGoogleAuth = async (token: string): Promise<{ userData: IUserWithITechnician; userToken: string; userRefreshToken: string }> => {
      try {
         const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.Google_clientID as string,
         });
         const payload = ticket.getPayload();
         if (payload?.email) {
            let userData: IUserWithITechnician = await this.userRepository.login(payload.email)
            if (!userData) {
               throw new Error("User not found");
            } else {
               if (userData.isBlocked) throw new Error("User is blocked");
               const userToken = createToken(userData.user_id as string, process.env.userRole as string);
               const userRefreshToken = createRefreshToken(userData.user_id as string, process.env.userRole as string);
               const profileImageS3_bucketURl = await generateGetPreSignedURL(userData.profileIMG as string);
               userData = { ...userData, password: "", profileIMG: profileImageS3_bucketURl };
               return { userData, userToken, userRefreshToken };
            };
         } else {
            throw new Error("User not found");
         };
      } catch (error) {
         throw error;
      };
   };

   register = async (userData: IUser): Promise<void> => {
      try {
         const alreadyExists: IUser | null = await this.userRepository.findByEmail(userData.email);
         if (alreadyExists) {
            throw new Error("Email already exists");
         };
         this.userData = userData;
         const Generated_OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
         this.OTP = Generated_OTP;
         console.log(`Generated OTP is : ${Generated_OTP}`);
         const isMailSended = await sendOTPmail(userData.email, Generated_OTP);
         if (!isMailSended) {
            throw new Error("Email not send");
         };
         const OTP_createdTime = new Date();
         this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000);
         return;
      } catch (error) {
         throw error;
      };
   };

   otpVerification = async (enteredOTP: string): Promise<IUser> => {
      try {
         if (enteredOTP !== this.OTP) {
            throw new Error("Incorrect OTP");
         }
         const currentTime = new Date();
         if (currentTime > this.expiryOTP_time!) {
            throw new Error("OTP is expired");
         }
         const hashedPassword = await bcrypt.hash(this.userData!.password as string, 10);
         this.userData!.password = hashedPassword;
         this.userData!.user_id = uuid();
         const response: IUser = await this.userRepository.register(this.userData!);
         this.OTP = null;
         this.expiryOTP_time = null;
         this.userData = null;
         return response;
      } catch (error) {
         throw error;
      };
   };

   resendOTP = async (): Promise<void> => {
      try {
         const Generated_OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
         this.OTP = Generated_OTP;
         console.log(`Re-generated OTP is : ${Generated_OTP}`);
         const isMailSended = await sendOTPmail(this.userData!.email, Generated_OTP);
         if (!isMailSended) {
            throw new Error("Email not send");
         }
         const OTP_createdTime = new Date();
         this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000);
      } catch (error) {
         throw error;
      };
   };

   createUpdateAddress = async (addressData: IUserAddress, user_id: string): Promise<boolean> => {
      try {
         const response = await axios.get(`https://nominatim.openstreetmap.org/search?postalcode=${addressData.pincode}&format=json&addressdetails=1`);
         if (response.data.length === 0) {
            throw new Error('Enter valid pincode');
         };

         const latitide = parseFloat(response.data[0].lat);
         const longitude = parseFloat(response.data[0].lon);

         const addressDetails: IUserAddress = {
            name: addressData.name,
            address: addressData.address,
            state: addressData.state,
            phone: addressData.phone,
            alternatePhone: addressData.alternatePhone,
            district: addressData.district,
            pincode: addressData.pincode,
            location: {
               type: "Point",
               coordinates: [longitude, latitide],
            }
         };
         return await this.userRepository.createUpdateAddress(addressDetails, user_id);
      } catch (error) {
         throw error
      };
   };

   deleteAddress = async (user_id: string): Promise<boolean> => {
      try {
         return await this.userRepository.deleteAddress(user_id);
      } catch (error) {
         throw error;
      };
   };

   updatePassword = async (user_id: string, currentPass: string, newPass: string): Promise<boolean> => {
      try {
         const userDetails = await this.userRepository.findByUser_id(user_id);
         if (!userDetails) {
            throw new Error("User not found");
         }
         const validCurrentPass = await bcrypt.compare(currentPass, userDetails.password as string);
         if (!validCurrentPass) {
            throw new Error("Current password is wrong");
         }
         const hashedNewPassword = await bcrypt.hash(newPass, 10);
         await this.userRepository.updatePassword(user_id, hashedNewPassword);
         return true;
      } catch (error) {
         throw error;
      };
   };

   updateProfileDetails = async (user_id: string, name: string, phone: string): Promise<boolean> => {
      try {
         const updatedInformation: { name: string; phone: string } = {
            name: name,
            phone: phone,
         };
         return await this.userRepository.updateProfileDetails(user_id, updatedInformation);
      } catch (error) {
         throw error;
      };
   };

   updateProfileImage = async (user_id: string, imageName: string): Promise<string> => {
      try {
         await this.userRepository.updateProfileImage(user_id, imageName);
         const newProfileImageURL = generateGetPreSignedURL(imageName);
         return newProfileImageURL;
      } catch (error) {
         throw error;
      };
   };

   getPreSignedURL = async (imageName: string, imageType: string): Promise<{ URL: string; uniqueImageName: string }> => {
      try {
         const uniqueImageName = `${Date.now()}_${imageName}`;
         const URL = await generatePutPreSignedURL(uniqueImageName, imageType);
         return { URL, uniqueImageName };
      } catch (error) {
         throw error;
      };
   };

   getTechnicians = async (user_id: string): Promise<ITechnicians[]> => {
      try {
         const result = await this.userRepository.getTechnicians(user_id);
         const afterUpdation: ITechnicians[] = await Promise.all(result.map(async (technician) => {
            const profileImageURL = technician.profileIMG ? await generateGetPreSignedURL(technician.profileIMG) : null;
            return { ...technician, profileIMG: profileImageURL } as ITechnicians;
         }));
         return afterUpdation;
      } catch (error) {
         throw error;
      }
   };

   getTechnicianWithPersonalDetails = async (technicianUser_id: string): Promise<IUserWithITechnician> => {
      try {
         let result: IUserWithITechnician = await this.userRepository.getTechnicianWithPersonalDetails(technicianUser_id);
         result = { ...result, profileIMG: await generateGetPreSignedURL(result.profileIMG) };
         if (result.ratingInformation?.reviews) {
            result.ratingInformation.reviews = await Promise.all(result.ratingInformation.reviews.map(async (review: IReview) => {
               const reviewer: IReviewerDetail | undefined = result.reviewerDetails?.find((reviewer: IReviewerDetail) => reviewer.user_id === review.rated_user_id);
               const reviewerProfileIMG = reviewer?.profileIMG ? await generateGetPreSignedURL(reviewer.profileIMG) : "";
               return { ...review, reviewerName: reviewer?.name, reviewerProfileIMG };
            }));
         }
         delete result.reviewerDetails;
         return result;
      } catch (error) {
         throw error;
      }
   };

   followTechnician = async (user_id: string, technicianUser_id: string): Promise<boolean> => {
      try {
         return await this.userRepository.followTechnician(user_id, technicianUser_id);
      } catch (error) {
         throw error;
      };
   };

   unfollowTechnician = async (user_id: string, technicianUser_id: string): Promise<boolean> => {
      try {
         return await this.userRepository.unfollowTechnician(user_id, technicianUser_id);
      } catch (error) {
         throw error;
      };
   };

   getFollowedTechnicians = async (user_id: string): Promise<IFollowedTechnician[]> => {
      try {
         let result: IFollowedTechnician[] = await this.userRepository.getFollowedTechnicians(user_id);
         result = await Promise.all(result.map(async (technician) => {
            const profileIMG = technician.SavedTechnicianPersonalInformation?.profileIMG ? await generateGetPreSignedURL(technician.SavedTechnicianPersonalInformation.profileIMG) : "";
            return { ...technician, SavedTechnicianPersonalInformation: { ...technician.SavedTechnicianPersonalInformation, profileIMG } };
         }));
         return result;
      } catch (error) {
         throw error;
      }
   };

   getChatFriends = async (user_id: string): Promise<any[]> => {
      try {
         let response = await this.userRepository.getChatFriends(user_id);
         response = await Promise.all(response.map(async (friend: any) => {
            const profileIMG = friend.technicianPersonalDetails?.profileIMG ? await generateGetPreSignedURL(friend.technicianPersonalDetails.profileIMG) : "";
            return { ...friend, technicianPersonalDetails: { ...friend.technicianPersonalDetails, profileIMG } };
         }));
         return response;
      } catch (error) {
         throw error;
      }
   };


   bookTechnician = async (client_id: string, client_name: string, technicianDetails: any, serviceLocation: IUserAddress, selectedDate: string): Promise<IBookingDetails> => {
      try {
         const technicianInformation: IUserWithITechnician = await this.userRepository.getTechnicianDetails(technicianDetails.user_id as string);
         if (technicianInformation.isBlocked || !technicianInformation.technicianDetails.availability) {
            throw new Error("Technician not available");
         };
         const TechnicianAllocatedAllSlots = technicianInformation?.technicianDetails.availableSlots;
         const checkAgainTechnicianIsAvailableOnSelectedDate = TechnicianAllocatedAllSlots?.find((slot: any) => slot.slotDate === selectedDate);
         if (!checkAgainTechnicianIsAvailableOnSelectedDate || checkAgainTechnicianIsAvailableOnSelectedDate?.slotBooked === true) {
            throw new Error("Technician is not available on selected date");
         };

         let serviceLocationLatitude: number = 0;
         let serviceLocationLongitude: number = 0

         try {
            const url = process.env.MapboxGeocodeUrl as string;
            const Map_Box_Access_Token = process.env.Map_Box_Access_Token as string;
            const response = await axios.get(`${url}/${serviceLocation.pincode}.json?access_token=${Map_Box_Access_Token}`);
            const coordinates = response.data.features[0]?.geometry?.coordinates;
            if (coordinates) {
               serviceLocationLongitude = coordinates[0];
               serviceLocationLatitude = coordinates[1];
            } else {
               throw new Error("Unable to find location for the provided pincode.");
            };
         } catch (error) {
            throw new Error("Unable to find location for the provided pincode.");
         };

         const date: Date = new Date();
         const newBookingDetails: IBookingDetails = {
            booking_id: uuid() as string,
            client_id: client_id as string,
            technicianUser_id: technicianDetails.user_id as string,
            bookingTime: date.toLocaleTimeString(),
            bookingDate: date.toLocaleDateString('en-CA'),
            booking_profession: technicianDetails?.technicianDetails.profession as string,
            booking_status: "Requested",
            serviceDate: selectedDate,
            serviceCompletedDate: "Pending",
            serviceCost: "Pending",
            payment_status: "Pending",
            serviceLocation: {
               address: serviceLocation.address,
               district: serviceLocation.district,
               state: serviceLocation.state,
               phone: serviceLocation.phone,
               alternatePhone: serviceLocation.alternatePhone,
               pincode: serviceLocation.pincode,
               location: {
                  type: "Point",
                  coordinates: [serviceLocationLongitude, serviceLocationLatitude]
               }
            }
         };
         const [bookingResponse] = await Promise.all([
            this.userRepository.bookTechnician(newBookingDetails),
            this.technicianRepository.bookSlot(technicianDetails.user_id, selectedDate),
            this.technicianRepository.addNotification(technicianDetails.user_id, `You have a booking request from ${client_name} on ${selectedDate}`)
         ]);
         if (bookingResponse) {
            io.to(`technicianNotificaionRoom${technicianDetails.user_id}`).emit("notification_to_technician", { message: "You have a new booking request" });
            return bookingResponse;
         } else {
            throw new Error("Booking failed");
         };
      } catch (error) {
         throw error;
      };
   };

   getBookingsHistory = async (user_id: string): Promise<IBookingHistory[]> => {
      try {
         return await this.userRepository.getBookingsHistory(user_id);
      } catch (error) {
         throw error;
      }
   };

   getBookingDetails = async (booking_id: string): Promise<any> => {
      try {
         let response: any = await this.userRepository.getBookingDetails(booking_id);
         response = { ...response, technicianDetails: { ...response.technicianDetails, profileIMG: await generateGetPreSignedURL(response.technicianDetails?.profileIMG) } };
         return response;
      } catch (error) {
         throw error;
      }
   };


   cancelBooking = async (booking_id: string, technician_id: string, userName: string, serviceDate: string): Promise<boolean> => {
      try {
         await this.userRepository.cancelBooking(booking_id);
         await Promise.all([
            await this.technicianRepository.addNotification(technician_id, `${userName} canceled their ${serviceDate} booking request.`),
            await this.technicianRepository.cancelBookingSlot(technician_id, serviceDate)
         ]);
         io.to(`technicianNotificaionRoom${technician_id}`).emit("notification_to_technician", { message: `${userName} canceled their ${serviceDate} booking request.` });
         return true;
      } catch (error) {
         throw error;
      };
   };

   proceedToPayment = async (booking_id: string, laborCost: string): Promise<Orders.RazorpayOrder> => {
      try {
         const amount = parseInt(laborCost, 10);
         const { razorpayKeyID, razorpayKeySecret } = process.env;
         const razorpayInstance = new Razorpay({
            key_id: razorpayKeyID as string,
            key_secret: razorpayKeySecret as string,
         });
         const razorpayOptions = {
            amount: amount * 100,
            currency: "INR",
            receipt: booking_id,
         };
         const response = await razorpayInstance.orders.create(razorpayOptions);
         return response;
      } catch (error) {
         throw error;
      };
   };

   verifyPayment = async (payment_id: string, order_id: string, signature: string, booking_id: string, amount: string, technicianUser_id: string): Promise<boolean> => {
      try {
         const body = `${order_id}|${payment_id}`;
         const razorpayKeySecret = process.env.razorpayKeySecret as string;
         const expectedSignature = crypto
            .createHmac("sha256", razorpayKeySecret)
            .update(body)
            .digest("hex");
         if (expectedSignature === signature) {
            const laborCharge = parseInt(amount) / 100;
            const newTransactionDetails: ITransaction = {
               amount: laborCharge,
               dateTime: new Date().toLocaleDateString(),
               transactionStatus: "Credit"
            };
            const [updateTechnicianWallet, updateBookingPaymentStatus] = await Promise.all([
               this.walletRepository.updateWallet(technicianUser_id, newTransactionDetails, laborCharge),
               this.userRepository.updateBookingPaymentStatus(booking_id, "Completed"),
            ]);
            if (!updateTechnicianWallet && !updateBookingPaymentStatus) {
               throw Error("Payment failed");
            };
            return true;
         } else {
            throw new Error("Invalid payment verification");
         };
      } catch (error) {
         throw error;
      };
   };

   submitReview = async (user_id: string, technicianUser_id: string, enteredRating: number, enteredFeedback: string, booking_id: string) => {
      try {
         const previousFeedbacks: IFeedbackRepository | null = await this.technicianRepository.getTechnicianFeedbacks(technicianUser_id);

         let totalRating = enteredRating;
         if (previousFeedbacks && previousFeedbacks.reviews.length > 0) {
            previousFeedbacks.reviews.forEach((singleRating: ISingleRating) => {
               totalRating += singleRating.starCount;
            });
         };

         const totalFeedbacks: number = (previousFeedbacks?.reviews.length || 0) + 1;

         const avgRating: number = Math.round(totalRating / totalFeedbacks);
         const ratingDetails: ISingleRating = {
            rated_user_id: user_id,
            starCount: enteredRating,
            review: enteredFeedback,
            date: new Date().toLocaleDateString('en-CA').toString(),
         };

         const [updateBookingFeedbackAdded, addNewFeedbackToTechnician] = await Promise.all([
            this.userRepository.updateBookingReviewAdded(booking_id, true),
            this.userRepository.addNewFeedbackToTechnician(technicianUser_id, ratingDetails),
            this.technicianRepository.updateTechnicianRating(technicianUser_id, avgRating)
         ]);

         if (updateBookingFeedbackAdded && addNewFeedbackToTechnician) {
            return true;
         } else {
            throw new Error("Something wrong please try again later");
         };
      } catch (error) {
         throw error;
      };
   };

};

export default UserServices;