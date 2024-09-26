"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_config_1 = require("../Config/jwt_config");
const s3_config_1 = require("../Config/s3_config");
const dotenv_1 = __importDefault(require("dotenv"));
const socket_config_1 = require("../Config/socket_config");
dotenv_1.default.config();
class AdminServices {
    constructor(adminRepository) {
        this.login = (email, password) => {
            try {
                const orginalEmail = process.env.Admin_email;
                const orginalPassword = process.env.Admin_password;
                if (orginalEmail === email) {
                    if (orginalPassword === password) {
                        const adminAccessToken = (0, jwt_config_1.createToken)(email, process.env.adminRole);
                        const adminRefreshToken = (0, jwt_config_1.createRefreshToken)(email, process.env.adminRole);
                        return { adminAccessToken, adminRefreshToken };
                    }
                    else {
                        throw new Error("Wrong password");
                    }
                    ;
                }
                else
                    throw new Error("Wrong email");
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.findUser = async () => {
            try {
                return await this.adminRepository.findUser();
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.unBlock = async (user_id) => {
            try {
                return await this.adminRepository.unBlock(user_id);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.block = async (user_id) => {
            try {
                const result = await this.adminRepository.block(user_id);
                socket_config_1.io.emit(`AdminBlockMessage${user_id}`, { message: "Your account has been temporarily blocked. Please contact our team for assistance." });
                return result;
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.findTechnician = async () => {
            try {
                return await this.adminRepository.findTechnician();
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.getCategories = async () => {
            try {
                const [categories, users, bookings] = await Promise.all([
                    this.adminRepository.getCategories(),
                    this.adminRepository.findUser(),
                    this.adminRepository.findBooking(),
                ]);
                const technicians = users.filter((user) => (user.isTechnician === true));
                return {
                    categories: categories || [],
                    userCount: users.length,
                    technicianCount: technicians.length,
                    bookingCount: bookings.length,
                };
            }
            catch (error) {
                throw error;
            }
        };
        this.fetchbookingsLocation = async () => {
            try {
                return await this.adminRepository.fetchbookingsLocation();
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.filteredBooking = async (selectedDates) => {
            try {
                return this.adminRepository.filteredBooking(selectedDates);
            }
            catch (error) {
                throw error;
            }
            ;
        };
        this.findBooking = async () => {
            try {
                let response = await this.adminRepository.findBooking();
                response = await Promise.all(response.map(async (booking) => {
                    const technicianProfileIMG = booking.technicianDetails?.profileIMG ? await (0, s3_config_1.generateGetPreSignedURL)(booking.technicianDetails.profileIMG) : "";
                    const userProfileIMG = booking.userDetails?.profileIMG ? await (0, s3_config_1.generateGetPreSignedURL)(booking.userDetails.profileIMG) : "";
                    return {
                        ...booking,
                        technicianDetails: { ...booking.technicianDetails, profileIMG: technicianProfileIMG },
                        userDetails: { ...booking.userDetails, profileIMG: userProfileIMG }
                    };
                }));
                return response;
            }
            catch (error) {
                throw error;
            }
        };
        this.adminRepository = adminRepository;
    }
    ;
}
;
exports.default = AdminServices;
