"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ratingSchema = new mongoose_1.Schema({
    user_id: {
        type: String,
    },
    reviews: {
        type: [{
                rated_user_id: {
                    type: String,
                },
                starCount: {
                    type: Number,
                },
                review: {
                    type: String,
                },
                date: {
                    type: String,
                },
                _id: false
            },],
        default: [],
    },
}, {
    versionKey: false,
});
const Rating = (0, mongoose_1.model)("Rating", ratingSchema);
exports.default = Rating;
