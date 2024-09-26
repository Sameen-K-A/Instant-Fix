"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    user_id: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    password: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    profileIMG: {
        type: String,
        default: "userDefaultProfile.png"
    },
    isTechnician: {
        type: Boolean,
        default: false
    },
    savedTechnicians: {
        type: [String]
    },
    addressDetails: {
        type: {
            name: { type: String },
            address: { type: String },
            district: { type: String },
            state: { type: String },
            pincode: { type: String },
            phone: { type: String },
            alternatePhone: { type: String },
            location: {
                type: { type: String, enum: ["Point"], default: "Point" },
                coordinates: { type: [Number], default: [0, 0] },
            }
        },
        default: null,
    },
    alreadychattedtechnician: {
        type: [String],
        default: [],
    }
}, {
    versionKey: false
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
