import UserRepository from "../Repository/userRepository";
import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";
import { SingleRatingType, TransactionType, userAddressType, userType } from "../interfaces";
import sendOTPmail from "../Config/email_config";
import TechnicianRepository from "../Repository/technicianRepository";
import { createToken, createRefreshToken } from "../Config/jwt_config";
import { newBookingType } from "../interfaces";
import { io } from "../Config/socket_config";
import axios from "axios";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import WalletRepository from "../Repository/WalletRepository";
import { IFeedbackRepository } from "../Interfaces/techinicianInterfaces";
import Technician from "../Model/technicianModel";
import Booking from "../Model/bookingModel";
import Rating from "../Model/reviewModal";
dotenv.config();
const walletRepository = new WalletRepository();

class UserServices {
   private userRepository: UserRepository;
   private OTP: string | null = null;
   private expiryOTP_time: Date | null = null;
   private userData: userType | null = null;
   private technicianRepository = new TechnicianRepository(Technician, Rating, Booking);

   constructor(userRepository: UserRepository) {
      this.userRepository = userRepository;
   };

   async loginUserService(email: string, password: string) {
      try {
         let userData = await this.userRepository.loginUserRepository(email);
         if (!userData) {
            throw new Error("email not found");
         }
         const comparePassword = await bcrypt.compare(password, userData.password);
         if (!comparePassword) {
            throw new Error("Wrong password");
         }
         if (userData.isBlocked) {
            throw new Error("User is blocked");
         }
         const userToken = createToken(userData.user_id as string);
         const userRefreshToken = createRefreshToken(userData.user_id as string);
         userData = { ...userData, password: null };
         return { userToken, userData, userRefreshToken };
      } catch (error) {
         throw error;
      }
   };

   async registerUserService(userData: userType): Promise<void> {
      try {
         const alreadyExists = await this.userRepository.findUserByEmail(userData.email);
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
         }
         const OTP_createdTime = new Date();
         this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000);
         console.log("step 2");
         return;
      } catch (error) {
         throw error;
      }
   };

   async otpVerifiedService(enteredOTP: string) {
      try {
         if (enteredOTP !== this.OTP) {
            throw new Error("Incorrect OTP");
         }
         const currentTime = new Date();
         if (currentTime > this.expiryOTP_time!) {
            throw new Error("OTP is expired");
         }
         const hashedPassword = await bcrypt.hash(this.userData!.password, 10);
         this.userData!.password = hashedPassword;
         this.userData!.user_id = uuid();
         const response = await this.userRepository.registerUserRepository(this.userData!);
         this.OTP = null;
         this.expiryOTP_time = null;
         this.userData = null;
         return response;
      } catch (error) {
         throw error;
      }
   };

   async resendOTPService(): Promise<void> {
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
      }
   };

   async add_EditAddressService(addAndEditAddressDetails: userAddressType, user_id: string) {
      try {
         const response = await axios.get(`https://nominatim.openstreetmap.org/search?postalcode=${addAndEditAddressDetails.pincode}&format=json&addressdetails=1`);
         if (response.data.length === 0) {
            throw new Error('Enter valid pincode');
         };

         const latitide = parseFloat(response.data[0].lat);
         const longitude = parseFloat(response.data[0].lon);

         const addressDetails: userAddressType = {
            name: addAndEditAddressDetails.name,
            address: addAndEditAddressDetails.address,
            state: addAndEditAddressDetails.state,
            phone: addAndEditAddressDetails.phone,
            alternatePhone: addAndEditAddressDetails.alternatePhone,
            district: addAndEditAddressDetails.district,
            pincode: addAndEditAddressDetails.pincode,
            location: {
               type: "Point",
               coordinates: [longitude, latitide],
            }
         };

         return await this.userRepository.add_EditAddressRepository(addressDetails, user_id);
      } catch (error) {
         throw error
      }
   };

   async deleteAddressService(address_id: string) {
      try {
         const repositoryResponse = await this.userRepository.deleteAddressRepository(address_id);
         if (repositoryResponse.modifiedCount == 1) {
            return "Deleted successfully"
         }
         else throw new Error("Not deleted");
      } catch (error) {
         throw error;
      }
   };

   async changePasswordService(user_id: string, currentPass: string, newPass: string) {
      try {
         const userDetails = await this.userRepository.findUserByUser_id(user_id);
         if (!userDetails) {
            throw new Error("User not found");
         }
         const validCurrentPass = await bcrypt.compare(currentPass, userDetails.password);
         if (!validCurrentPass) {
            throw new Error("Current password is wrong");
         }
         const hashedNewPassword = await bcrypt.hash(newPass, 10);
         await this.userRepository.changepasswordRepository(user_id, hashedNewPassword);
      } catch (error) {
         throw error;
      }
   };

   async editProfileService(user_id: string, name: string, phone: string, profileIMG: string | null): Promise<string> {
      try {
         const updatedInformation: { name: string; phone: string; profileIMG?: string } = {
            name: name,
            phone: phone,
         };
         if (profileIMG) {
            updatedInformation.profileIMG = profileIMG;
         }
         const repositoryResponse = await this.userRepository.editProfileRepository(user_id, updatedInformation);
         if (repositoryResponse.modifiedCount === 0) {
            throw new Error("No changes founded");
         }
         return "okay";
      } catch (error) {
         throw error;
      }
   };

   async fetchTechnicianService(user_id: string) {
      try {
         return await this.userRepository.fetchTechnicianRepository(user_id);
      } catch (error) {
         console.log("Fetch technician service error : ", error);
         throw error;
      }
   };

   async fetchTechnicianIndividualInformationService(technicianUser_id: string) {
      try {
         const result = await this.userRepository.fetchTechnicianIndividualInformationRepository(technicianUser_id);

         result.ratingInformation.reviews = result.ratingInformation.reviews.map((review: any) => {
            const reviewer = result.reviewerDetails.find((reviewer: any) => reviewer.user_id === review.rated_user_id);
            return { ...review, reviewerName: reviewer?.name, reviewerProfileIMG: reviewer?.profileIMG, };
         });
         delete result.reviewerDetails;

         return result;
      } catch (error) {
         throw error;
      };
   };

   async saveTechnicianService(user_id: string, technicianUser_id: string) {
      try {
         const response = await this.userRepository.saveTechnicianRepository(user_id, technicianUser_id);
         if (response.modifiedCount !== 1) {
            throw new Error("Can't save technician");
         };
         return;
      } catch (error) {
         throw error;
      };
   };

   async unSaveTechnicianService(user_id: string, technicianUser_id: string) {
      try {
         const response = await this.userRepository.unSaveTechnicianRepository(user_id, technicianUser_id);
         if (response.modifiedCount !== 1) {
            throw new Error("Can't unsave technician");
         };
         return;
      } catch (error) {
         throw error;
      };
   };

   async fetchSavedTechnicianDetailsService(user_id: string) {
      try {
         return await this.userRepository.fetchSavedTechnicianDetailsRepository(user_id);
      } catch (error) {
         throw error;
      };
   };

   async fetchAlreadyChattedTechniciansService(user_id: string) {
      try {
         return await this.userRepository.fetchAlreadyChattedTechniciansRepository(user_id);
      } catch (error) {
         throw error;
      }
   };

   async bookTechnicianService(client_id: string, client_name: string, technicianDetails: any, serviceLocation: userAddressType, selectedDate: string) {
      try {
         const technicianInformation: any = await this.userRepository.fetchSingleTechnicianDetailsRepository(technicianDetails.user_id as string);
         if (technicianInformation[0].isBlocked || !technicianInformation[0].technicianDetails.availability) {
            throw new Error("Technician not available");
         };
         const TechnicianAllocatedAllSlots = technicianInformation[0]?.technicianDetails?.availableSlots;
         const checkAgainTechnicianIsAvailableOnSelectedDate = TechnicianAllocatedAllSlots.find((slot: any) => slot.slotDate === selectedDate);
         if (!checkAgainTechnicianIsAvailableOnSelectedDate || checkAgainTechnicianIsAvailableOnSelectedDate?.slotBooked === true) {
            throw new Error("Technician is not available on selected date");
         };

         //// for fetching client service location coordinates (latitude and logitude)
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
               console.log("Unable to find location for the provided pincode. 1")
               throw new Error("Unable to find location for the provided pincode.");
            };
         } catch (error) {
            console.log("Unable to find location for the provided pincode. 2 ")
            throw new Error("Unable to find location for the provided pincode.");
         };

         const date: Date = new Date();
         const newBookingDetails: newBookingType = {
            booking_id: uuid() as string,
            client_id: client_id as string,
            technicianUser_id: technicianDetails.user_id as string,
            bookingTime: date.toLocaleTimeString(),
            bookingDate: date.toLocaleDateString(),
            Booking_profession: technicianDetails?.technicianDetails.profession as string,
            booking_status: "Requested",
            serviceDate: selectedDate,
            serviceCompletedDate: "Pending",
            serviceCost: "Pending",
            Payment_Status: "Pending",
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
            this.userRepository.bookTechnicianRepository(newBookingDetails),
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

   async fetchUserBookingHistoryService(user_id: string) {
      try {
         return await this.userRepository.fetchUserBookingHistoryRepository(user_id);
      } catch (error) {
         throw error;
      }
   };

   async fetchIndividualBookingInformationService(booking_id: string) {
      try {
         return await this.userRepository.fetchIndividualBookingInformationRepository(booking_id)
      } catch (error) {
         throw error;
      }
   };

   async cancelBookingService(booking_id: string, technician_id: string, userName: string, serviceDate: string) {
      try {
         const response = await this.userRepository.cancelBookingRepository(booking_id);
         if (response.modifiedCount === 1) {
            await Promise.all([
               await this.technicianRepository.addNotification(technician_id, `${userName} canceled their ${serviceDate} booking request.`),
               await this.technicianRepository.cancelBookingSlot(technician_id, serviceDate)
            ]);
            io.to(`technicianNotificaionRoom${technician_id}`).emit("notification_to_technician", { message: `${userName} canceled their ${serviceDate} booking request.` });
            return true;
         } else {
            throw new Error("Booking status is not changed");
         };
      } catch (error) {
         throw error;
      };
   };

   async proceedToPaymentService(booking_id: string, laborCost: string) {
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

   async verifyPaymentService(payment_id: string, order_id: string, signature: string, booking_id: string, amount: string, technicianUser_id: string) {
      try {
         const body = `${order_id}|${payment_id}`;
         const razorpayKeySecret = process.env.razorpayKeySecret as string;
         const expectedSignature = crypto
            .createHmac("sha256", razorpayKeySecret)
            .update(body)
            .digest("hex");
         if (expectedSignature === signature) {
            const laborCharge = parseInt(amount) / 100;
            const newTransactionDetails: TransactionType = {
               amount: laborCharge,
               dateTime: new Date().toLocaleDateString(),
               transactionStatus: "Credit"
            };
            const [updateTechnicianWallet, updateBookingPaymentStatus] = await Promise.all([
               walletRepository.addNewTransactionAndUpdateTotalAmount(technicianUser_id, newTransactionDetails, laborCharge),
               this.userRepository.updateBookingPaymentStatus(booking_id, "Completed"),
            ]);
            if (updateTechnicianWallet.modifiedCount !== 1 && updateBookingPaymentStatus.modifiedCount !== 1) {
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

   async submitReviewService(user_id: string, technicianUser_id: string, enteredRating: number, enteredFeedback: string, booking_id: string) {
      try {
         const previousFeedbacks: IFeedbackRepository | null = await this.technicianRepository.getTechnicianFeedbacks(technicianUser_id);

         let totalRating = enteredRating;
         if (previousFeedbacks && previousFeedbacks.reviews.length > 0) {
            previousFeedbacks.reviews.forEach((singleRating: SingleRatingType) => {
               totalRating += singleRating.starCount;
            });
         };

         const totalFeedbacks: number = (previousFeedbacks?.reviews.length || 0) + 1;

         const avgRating: number = Math.round(totalRating / totalFeedbacks);
         const ratingDetails: SingleRatingType = {
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

         if (updateBookingFeedbackAdded.modifiedCount === 1 && addNewFeedbackToTechnician.modifiedCount === 1) {
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