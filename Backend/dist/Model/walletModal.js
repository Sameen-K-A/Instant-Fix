"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const walletSchema = new mongoose_1.Schema({
    user_id: {
        type: String,
    },
    balanceAmount: {
        type: Number,
        default: 0,
    },
    transactions: {
        type: [{
                amount: {
                    type: Number,
                },
                dateTime: {
                    type: String,
                },
                transactionStatus: {
                    type: String,
                    enum: ["Debit", "Credit"],
                    required: true,
                },
                _id: false,
            }],
        default: [],
    },
}, {
    versionKey: false,
});
const Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
exports.default = Wallet;
