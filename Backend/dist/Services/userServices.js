"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const email_config_1 = __importDefault(require("../Config/email_config"));
const jwt_config_1 = require("../Config/jwt_config");
const socket_config_1 = require("../Config/socket_config");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const s3_config_1 = require("../Config/s3_config");
const google_auth_library_1 = require("google-auth-library");
dotenv_1.default.config();
const client = new google_auth_library_1.OAuth2Client(`${process.env.Google_clientID}`);
class UserServices {
    constructor(userRepository, technicianRepository, walletRepository) {
        this.OTP = null;
        this.expiryOTP_time = null;
        this.userData = null;
        this.login = async (email, password) => {
            try {
                let userData = await this.userRepository.login(email);
                if (!userData)
                    throw new Error("email not found");
                const comparePassword = await bcrypt_1.default.compare(password, userData.password);
                if (!comparePassword)
                    throw new Error("Wrong password");
                if (userData.isBlocked)
                    throw new Error("User is blocked");
                const userToken = (0, jwt_config_1.createToken)(userData.user_id, process.env.userRole);
                const userRefreshToken = (0, jwt_config_1.createRefreshToken)(userData.user_id, process.env.userRole);
                const profileImageS3_bucketURl = await (0, s3_config_1.generateGetPreSignedURL)(userData.profileIMG);
                userData = { ...userData, password: "", profileIMG: profileImageS3_bucketURl };
                return { userData, userToken, userRefreshToken };
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.verifyGoogleAuth = async (token) => {
            try {
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: process.env.Google_clientID,
                });
                const payload = ticket.getPayload();
                if (payload?.email) {
                    let userData = await this.userRepository.login(payload.email);
                    if (!userData) {
                        throw new Error("User not found");
                    }
                    else {
                        if (userData.isBlocked)
                            throw new Error("User is blocked");
                        const userToken = (0, jwt_config_1.createToken)(userData.user_id, process.env.userRole);
                        const userRefreshToken = (0, jwt_config_1.createRefreshToken)(userData.user_id, process.env.userRole);
                        const profileImageS3_bucketURl = await (0, s3_config_1.generateGetPreSignedURL)(userData.profileIMG);
                        userData = { ...userData, password: "", profileIMG: profileImageS3_bucketURl };
                        return { userData, userToken, userRefreshToken };
                    }
                    ;
                }
                else {
                    throw new Error("User not found");
                }
                ;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.register = async (userData) => {
            try {
                const alreadyExists = await this.userRepository.findByEmail(userData.email);
                if (alreadyExists) {
                    throw new Error("Email already exists");
                }
                ;
                this.userData = userData;
                const Generated_OTP = Math.floor(1000 + Math.random() * 9000).toString();
                this.OTP = Generated_OTP;
                console.log(`Generated OTP is : ${Generated_OTP}`);
                const isMailSended = await (0, email_config_1.default)(userData.email, Generated_OTP);
                if (!isMailSended) {
                    throw new Error("Email not send");
                }
                ;
                const OTP_createdTime = new Date();
                this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000);
                return;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.otpVerification = async (enteredOTP) => {
            try {
                if (enteredOTP !== this.OTP) {
                    throw new Error("Incorrect OTP");
                }
                const currentTime = new Date();
                if (currentTime > this.expiryOTP_time) {
                    throw new Error("OTP is expired");
                }
                const hashedPassword = await bcrypt_1.default.hash(this.userData.password, 10);
                this.userData.password = hashedPassword;
                this.userData.user_id = (0, uuid_1.v4)();
                const response = await this.userRepository.register(this.userData);
                this.OTP = null;
                this.expiryOTP_time = null;
                this.userData = null;
                return response;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.resendOTP = async () => {
            try {
                const Generated_OTP = Math.floor(1000 + Math.random() * 9000).toString();
                this.OTP = Generated_OTP;
                console.log(`Re-generated OTP is : ${Generated_OTP}`);
                const isMailSended = await (0, email_config_1.default)(this.userData.email, Generated_OTP);
                if (!isMailSended) {
                    throw new Error("Email not send");
                }
                const OTP_createdTime = new Date();
                this.expiryOTP_time = new Date(OTP_createdTime.getTime() + 2 * 60 * 1000);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.createUpdateAddress = async (addressData, user_id) => {
            try {
                const response = await axios_1.default.get(`https://nominatim.openstreetmap.org/search?postalcode=${addressData.pincode}&format=json&addressdetails=1`);
                if (response.data.length === 0) {
                    throw new Error('Enter valid pincode');
                }
                ;
                const latitide = parseFloat(response.data[0].lat);
                const longitude = parseFloat(response.data[0].lon);
                const addressDetails = {
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
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.deleteAddress = async (user_id) => {
            try {
                return await this.userRepository.deleteAddress(user_id);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.updatePassword = async (user_id, currentPass, newPass) => {
            try {
                const userDetails = await this.userRepository.findByUser_id(user_id);
                if (!userDetails) {
                    throw new Error("User not found");
                }
                const validCurrentPass = await bcrypt_1.default.compare(currentPass, userDetails.password);
                if (!validCurrentPass) {
                    throw new Error("Current password is wrong");
                }
                const hashedNewPassword = await bcrypt_1.default.hash(newPass, 10);
                await this.userRepository.updatePassword(user_id, hashedNewPassword);
                return true;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.updateProfileDetails = async (user_id, name, phone) => {
            try {
                const updatedInformation = {
                    name: name,
                    phone: phone,
                };
                return await this.userRepository.updateProfileDetails(user_id, updatedInformation);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.updateProfileImage = async (user_id, imageName) => {
            try {
                await this.userRepository.updateProfileImage(user_id, imageName);
                const newProfileImageURL = (0, s3_config_1.generateGetPreSignedURL)(imageName);
                return newProfileImageURL;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.getPreSignedURL = async (imageName, imageType) => {
            try {
                const uniqueImageName = `${Date.now()}_${imageName}`;
                const URL = await (0, s3_config_1.generatePutPreSignedURL)(uniqueImageName, imageType);
                return { URL, uniqueImageName };
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.getTechnicians = async (user_id) => {
            try {
                const result = await this.userRepository.getTechnicians(user_id);
                const afterUpdation = await Promise.all(result.map(async (technician) => {
                    const profileImageURL = technician.profileIMG ? await (0, s3_config_1.generateGetPreSignedURL)(technician.profileIMG) : null;
                    return { ...technician, profileIMG: profileImageURL };
                }));
                return afterUpdation;
            }
            catch (error) {
                throw error;
            }
        };
        this.getTechnicianWithPersonalDetails = async (technicianUser_id) => {
            try {
                let result = await this.userRepository.getTechnicianWithPersonalDetails(technicianUser_id);
                result = { ...result, profileIMG: await (0, s3_config_1.generateGetPreSignedURL)(result.profileIMG) };
                if (result.ratingInformation?.reviews) {
                    result.ratingInformation.reviews = await Promise.all(result.ratingInformation.reviews.map(async (review) => {
                        const reviewer = result.reviewerDetails?.find((reviewer) => reviewer.user_id === review.rated_user_id);
                        const reviewerProfileIMG = reviewer?.profileIMG ? await (0, s3_config_1.generateGetPreSignedURL)(reviewer.profileIMG) : "";
                        return { ...review, reviewerName: reviewer?.name, reviewerProfileIMG };
                    }));
                }
                delete result.reviewerDetails;
                return result;
            }
            catch (error) {
                throw error;
            }
        };
        this.followTechnician = async (user_id, technicianUser_id) => {
            try {
                return await this.userRepository.followTechnician(user_id, technicianUser_id);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.unfollowTechnician = async (user_id, technicianUser_id) => {
            try {
                return await this.userRepository.unfollowTechnician(user_id, technicianUser_id);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.getFollowedTechnicians = async (user_id) => {
            try {
                let result = await this.userRepository.getFollowedTechnicians(user_id);
                result = await Promise.all(result.map(async (technician) => {
                    const profileIMG = technician.SavedTechnicianPersonalInformation?.profileIMG ? await (0, s3_config_1.generateGetPreSignedURL)(technician.SavedTechnicianPersonalInformation.profileIMG) : "";
                    return { ...technician, SavedTechnicianPersonalInformation: { ...technician.SavedTechnicianPersonalInformation, profileIMG } };
                }));
                return result;
            }
            catch (error) {
                throw error;
            }
        };
        this.getChatFriends = async (user_id) => {
            try {
                let response = await this.userRepository.getChatFriends(user_id);
                response = await Promise.all(response.map(async (friend) => {
                    const profileIMG = friend.technicianPersonalDetails?.profileIMG ? await (0, s3_config_1.generateGetPreSignedURL)(friend.technicianPersonalDetails.profileIMG) : "";
                    return { ...friend, technicianPersonalDetails: { ...friend.technicianPersonalDetails, profileIMG } };
                }));
                return response;
            }
            catch (error) {
                throw error;
            }
        };
        this.bookTechnician = async (client_id, client_name, technicianDetails, serviceLocation, selectedDate) => {
            try {
                const technicianInformation = await this.userRepository.getTechnicianDetails(technicianDetails.user_id);
                if (technicianInformation.isBlocked || !technicianInformation.technicianDetails.availability) {
                    throw new Error("Technician not available");
                }
                ;
                const TechnicianAllocatedAllSlots = technicianInformation?.technicianDetails.availableSlots;
                const checkAgainTechnicianIsAvailableOnSelectedDate = TechnicianAllocatedAllSlots?.find((slot) => slot.slotDate === selectedDate);
                if (!checkAgainTechnicianIsAvailableOnSelectedDate || checkAgainTechnicianIsAvailableOnSelectedDate?.slotBooked === true) {
                    throw new Error("Technician is not available on selected date");
                }
                ;
                let serviceLocationLatitude = 0;
                let serviceLocationLongitude = 0;
                try {
                    const url = process.env.MapboxGeocodeUrl;
                    const Map_Box_Access_Token = process.env.Map_Box_Access_Token;
                    const response = await axios_1.default.get(`${url}/${serviceLocation.pincode}.json?access_token=${Map_Box_Access_Token}`);
                    const coordinates = response.data.features[0]?.geometry?.coordinates;
                    if (coordinates) {
                        serviceLocationLongitude = coordinates[0];
                        serviceLocationLatitude = coordinates[1];
                    }
                    else {
                        throw new Error("Unable to find location for the provided pincode.");
                    }
                    ;
                }
                catch (error) {
                    throw new Error("Unable to find location for the provided pincode.");
                }
                ;
                const date = new Date();
                const newBookingDetails = {
                    booking_id: (0, uuid_1.v4)(),
                    client_id: client_id,
                    technicianUser_id: technicianDetails.user_id,
                    bookingTime: date.toLocaleTimeString(),
                    bookingDate: date.toLocaleDateString('en-CA'),
                    booking_profession: technicianDetails?.technicianDetails.profession,
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
                    socket_config_1.io.to(`technicianNotificaionRoom${technicianDetails.user_id}`).emit("notification_to_technician", { message: "You have a new booking request" });
                    return bookingResponse;
                }
                else {
                    throw new Error("Booking failed");
                }
                ;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.getBookingsHistory = async (user_id) => {
            try {
                return await this.userRepository.getBookingsHistory(user_id);
            }
            catch (error) {
                throw error;
            }
        };
        this.getBookingDetails = async (booking_id) => {
            try {
                let response = await this.userRepository.getBookingDetails(booking_id);
                response = { ...response, technicianDetails: { ...response.technicianDetails, profileIMG: await (0, s3_config_1.generateGetPreSignedURL)(response.technicianDetails?.profileIMG) } };
                return response;
            }
            catch (error) {
                throw error;
            }
        };
        this.cancelBooking = async (booking_id, technician_id, userName, serviceDate) => {
            try {
                await this.userRepository.cancelBooking(booking_id);
                await Promise.all([
                    await this.technicianRepository.addNotification(technician_id, `${userName} canceled their ${serviceDate} booking request.`),
                    await this.technicianRepository.cancelBookingSlot(technician_id, serviceDate)
                ]);
                socket_config_1.io.to(`technicianNotificaionRoom${technician_id}`).emit("notification_to_technician", { message: `${userName} canceled their ${serviceDate} booking request.` });
                return true;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.proceedToPayment = async (booking_id, laborCost) => {
            try {
                const amount = parseInt(laborCost, 10);
                const { razorpayKeyID, razorpayKeySecret } = process.env;
                const razorpayInstance = new razorpay_1.default({
                    key_id: razorpayKeyID,
                    key_secret: razorpayKeySecret,
                });
                const razorpayOptions = {
                    amount: amount * 100,
                    currency: "INR",
                    receipt: booking_id,
                };
                const response = await razorpayInstance.orders.create(razorpayOptions);
                return response;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.verifyPayment = async (payment_id, order_id, signature, booking_id, amount, technicianUser_id) => {
            try {
                const body = `${order_id}|${payment_id}`;
                const razorpayKeySecret = process.env.razorpayKeySecret;
                const expectedSignature = crypto_1.default
                    .createHmac("sha256", razorpayKeySecret)
                    .update(body)
                    .digest("hex");
                if (expectedSignature === signature) {
                    const laborCharge = parseInt(amount) / 100;
                    const newTransactionDetails = {
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
                    }
                    ;
                    return true;
                }
                else {
                    throw new Error("Invalid payment verification");
                }
                ;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.submitReview = async (user_id, technicianUser_id, enteredRating, enteredFeedback, booking_id) => {
            try {
                const previousFeedbacks = await this.technicianRepository.getTechnicianFeedbacks(technicianUser_id);
                let totalRating = enteredRating;
                if (previousFeedbacks && previousFeedbacks.reviews.length > 0) {
                    previousFeedbacks.reviews.forEach((singleRating) => {
                        totalRating += singleRating.starCount;
                    });
                }
                ;
                const totalFeedbacks = (previousFeedbacks?.reviews.length || 0) + 1;
                const avgRating = Math.round(totalRating / totalFeedbacks);
                const ratingDetails = {
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
                }
                else {
                    throw new Error("Something wrong please try again later");
                }
                ;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.userRepository = userRepository;
        this.technicianRepository = technicianRepository;
        this.walletRepository = walletRepository;
    }
    ;
}
;
exports.default = UserServices;
