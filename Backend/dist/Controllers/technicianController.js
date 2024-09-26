"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
class TechnicianController {
    constructor(technicianService) {
        this.createTechnician = async (req, res) => {
            try {
                const { user_id, profession } = req.query;
                const serviceResult = await this.technicianService.createTechnician(user_id, profession);
                res.status(httpStatusCode_1.default.OK).json(serviceResult);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).json({ message: 'Internal Server Error' });
            }
            ;
        };
        this.updateProfession = async (req, res) => {
            try {
                const { user_id, profession } = req.body;
                await this.technicianService.updateProfession(user_id, profession);
                res.status(httpStatusCode_1.default.OK).send("Changes commit successfully");
            }
            catch (error) {
                if (error.message === "No changes found") {
                    res.status(httpStatusCode_1.default.NoChange).json({ message: "No changes found" });
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json(error);
                }
                ;
            }
            ;
        };
        this.updateAvailableStatus = async (req, res) => {
            try {
                const { user_id, newStatus } = req.body;
                await this.technicianService.updateAvailableStatus(user_id, newStatus);
                res.status(httpStatusCode_1.default.OK).send("Changes completed successfully");
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).json(error);
            }
            ;
        };
        this.getBookings = async (req, res) => {
            try {
                const technicianUserID = req.query.technicianUserID;
                const result = await this.technicianService.getBookings(technicianUserID);
                res.status(httpStatusCode_1.default.OK).json(result);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).json({ message: "Something wrong please try again later" });
            }
            ;
        };
        this.getTechnicianInfo = async (req, res) => {
            try {
                const technicianUser_id = req.query.technicianUserID;
                const serviceResponse = await this.technicianService.getTechnicianInfo(technicianUser_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later.");
            }
            ;
        };
        this.getBookingDetails = async (req, res) => {
            try {
                const booking_id = req.query.booking_id;
                const response = await this.technicianService.getBookingDetails(booking_id);
                res.status(httpStatusCode_1.default.OK).json(response);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).send("Can't collect booking details");
            }
            ;
        };
        this.updateBookingStatus = async (req, res) => {
            try {
                const { booking_id, newStatus, technician_id, serviceDate } = req.body;
                await this.technicianService.updateBookingStatus(booking_id, newStatus, technician_id, serviceDate);
                res.status(httpStatusCode_1.default.OK).json({ message: "Status changed successfully" });
            }
            catch (error) {
                if (error.message === "Status is not changed") {
                    res.status(httpStatusCode_1.default.NoChange).send("Status is not changed");
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json(error);
                }
                ;
            }
            ;
        };
        this.completeBooking = async (req, res) => {
            try {
                const { booking_id, client_id, laborCharge } = req.body;
                await this.technicianService.completeBooking(booking_id, client_id, laborCharge);
                res.status(httpStatusCode_1.default.OK).send("Booking completed");
            }
            catch (error) {
                if (error.message === "Booking details is not changed") {
                    res.status(httpStatusCode_1.default.NoChange).send("Booking details is not changed");
                }
                else if (error.message === "Can't find the client details") {
                    res.status(httpStatusCode_1.default.NotFound).send("Can't find the client details");
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later.");
                }
                ;
            }
            ;
        };
        this.deleteNotification = async (req, res) => {
            try {
                const technicianUser_id = req.body.technicianUser_id;
                await this.technicianService.deleteNotification(technicianUser_id);
                res.status(httpStatusCode_1.default.OK).send("Notification cleared successfully");
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).send("Can't clear notifications.");
            }
            ;
        };
        this.updateAvailableSlots = async (req, res) => {
            try {
                const technician_id = req.body.technician_id;
                const slots = req.body.slots;
                await this.technicianService.updateAvailableSlots(technician_id, slots);
                res.status(httpStatusCode_1.default.OK).send("Slot modified completed successfully");
            }
            catch (error) {
                if (error.message === "Slot modification is failed.") {
                    res.status(httpStatusCode_1.default.NoChange).send("Slot modification is failed.");
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).send("something worng please try again later.");
                }
                ;
            }
            ;
        };
        this.getWallet = async (req, res) => {
            try {
                const user_id = req.query.user_id;
                const serviceResponse = await this.technicianService.getWallet(user_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong, Please try again later.");
            }
            ;
        };
        this.getRatingWithReviewerDetails = async (req, res) => {
            try {
                const technicianUser_id = req.query.technicianUser_id;
                const serviceResponse = await this.technicianService.getRatingWithReviewerDetails(technicianUser_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later.");
            }
            ;
        };
        this.technicianService = technicianService;
    }
    ;
}
;
exports.default = TechnicianController;
