"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
class AdminController {
    constructor(adminService) {
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                const serviceResponse = await this.adminService.login(email, password);
                res.cookie("AdminRefreshToken", serviceResponse.adminRefreshToken, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.cookie("AdminAccessToken", serviceResponse.adminAccessToken, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    maxAge: 15 * 60 * 1000,
                });
                res.status(httpStatusCode_1.default.OK).send(serviceResponse);
            }
            catch (error) {
                if (error.message === "Wrong email") {
                    res.status(httpStatusCode_1.default.NotFound).json({ message: "Email not found" });
                }
                else if (error.message === "Wrong password") {
                    res.status(httpStatusCode_1.default.Unauthorized).json({ message: "Password is wrong" });
                }
                else {
                    res.status(httpStatusCode_1.default.InternalServerError).json(error);
                }
                ;
            }
            ;
        };
        this.findUser = async (req, res) => {
            try {
                const serviceResponse = await this.adminService.findUser();
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).json("Something wrong please try again later");
            }
            ;
        };
        this.unBlock = async (req, res) => {
            try {
                const user_id = req.query.user_id;
                const serviceResponse = await this.adminService.unBlock(user_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).json("Something went wrong, please try again later");
            }
            ;
        };
        this.block = async (req, res) => {
            try {
                const user_id = req.query.user_id;
                const serviceResponse = await this.adminService.block(user_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).json("Something went wrong, please try again later");
            }
            ;
        };
        this.findTechnician = async (req, res) => {
            try {
                const controllResponse = await this.adminService.findTechnician();
                res.status(httpStatusCode_1.default.OK).json(controllResponse);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later");
            }
            ;
        };
        this.findBooking = async (req, res) => {
            try {
                const response = await this.adminService.findBooking();
                res.status(httpStatusCode_1.default.OK).json(response);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later");
            }
            ;
        };
        this.fetchbookingsLocation = async (req, res) => {
            try {
                const response = await this.adminService.fetchbookingsLocation();
                res.status(httpStatusCode_1.default.OK).json(response);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later");
            }
            ;
        };
        this.getCategories = async (req, res) => {
            try {
                const response = await this.adminService.getCategories();
                res.status(httpStatusCode_1.default.OK).json(response);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later");
            }
            ;
        };
        this.filteredBooking = async (req, res) => {
            try {
                const selectedDates = req.query.selectedDates;
                const response = await this.adminService.filteredBooking(selectedDates);
                res.status(httpStatusCode_1.default.OK).json(response);
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later");
            }
            ;
        };
        this.logout = async (req, res) => {
            try {
                res.clearCookie("AdminRefreshToken", { httpOnly: true });
                res.clearCookie("AdminAccessToken", { httpOnly: true });
                res.status(httpStatusCode_1.default.OK).send('Logged out successfully');
            }
            catch (error) {
                res.status(httpStatusCode_1.default.InternalServerError).send("Something wrong please try again later");
            }
            ;
        };
        this.adminService = adminService;
    }
}
;
exports.default = AdminController;
