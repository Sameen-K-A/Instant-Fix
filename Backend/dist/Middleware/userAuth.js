"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModal_1 = __importDefault(require("../Model/userModal"));
const bookingModel_1 = __importDefault(require("../Model/bookingModel"));
const reviewModal_1 = __importDefault(require("../Model/reviewModal"));
const userRepository_1 = __importDefault(require("../Repository/userRepository"));
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const userRepository = new userRepository_1.default(userModal_1.default, bookingModel_1.default, reviewModal_1.default);
async function isBloked(req, res, next) {
    try {
        const user_id = req.user_id;
        if (!user_id) {
            return res.status(httpStatusCode_1.default.Unauthorized).json({ message: 'Access denied. User ID not found.' });
        }
        ;
        const isBlocked = await userRepository.userIsBlocked(user_id);
        console.log("user is blocked => ", isBlocked);
        if (isBlocked === true) {
            return res.status(httpStatusCode_1.default.Unauthorized).json({ message: 'Access denied. User is blocked.' });
        }
        next();
    }
    catch (error) {
        return res.status(httpStatusCode_1.default.InternalServerError).json({ message: 'Server error.' });
    }
}
exports.default = isBloked;
