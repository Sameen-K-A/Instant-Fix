"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendConfirmBookingmail = async (email, laborCharge, booking_id) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ServerEmail,
            pass: process.env.ServerPassword,
        },
    });
    const mailOptions = {
        from: process.env.ServerEmail,
        to: email,
        subject: 'Payment Request for Completed Service - Instant-Fix',
        html: `
      <div style="font-family: Helvetica, Arial, sans-serif; min-width: 100px; overflow: auto; line-height: 1.6; color: #333;">
        <div style="margin: 50px auto; width: 70%; padding: 20px 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #341919;">Service Completed Successfully!</h1>
          <p style="font-size: 1.1em">Dear ${email},</p>
          <p>We are pleased to inform you that your service request with Booking ID <strong>${booking_id}</strong> has been successfully completed by our technician. We appreciate your trust in Instant-Fix.</p>
          <h3 style="color: #341919;">Payment Request Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Service Charge:</strong> ₹${laborCharge}.00</li>
            <li><strong>Booking ID:</strong> ${booking_id}</li>
          </ul>
          <p>To complete the payment, please open the Instant-Fix application and proceed with the payment process. If you encounter any issues or need further assistance, our support team is here to help.</p>
          <p style="font-size: 0.9em;">Thank you for choosing Instant-Fix. We look forward to serving you again soon!</p>
          <p style="font-size: 0.9em;">Best regards,<br />The Instant-Fix Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.8em; color: #999;">This is an automated message, please do not reply directly to this email.</p>
        </div>
      </div>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Booking confirmation mail sent to email");
        return true;
    }
    catch (error) {
        console.error("Error in sending booking confirmation email:", error);
        return false;
    }
};
exports.default = sendConfirmBookingmail;
