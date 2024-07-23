import dotenv from "dotenv";
import nodemailer, { Transporter } from "nodemailer";

dotenv.config();
const ServerEmail: string = process.env.ServerEmail as string;
const ServerPassword: string = process.env.ServerPassword as string;

const sendOTPmail = async (email: string, otp: string): Promise<boolean> => {
   const transporter: Transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: ServerEmail,
         pass: ServerPassword
      }
   });

   const mailOptions = {
      from: ServerEmail,
      to: email,
      subject: 'Instant-Fix',
      html: `
            <div style="font-family: Helvetica, Arial, sans-serif; min-width: 100px; overflow: auto; line-height: 2">
                <div style="margin: 50px auto; width: 70%; padding: 20px 0">
                    <p style="font-size: 1.1em">Hi ${email},</p>
                    <p>This message from Instant-Fix. Use the following OTP to complete your register procedures. OTP is valid for Two minutes</p>
                    <h2 style="background: linear-gradient(331deg, rgba(78, 0, 126, 1) 0%, rgba(184, 69, 255, 1) 46%, rgb(217, 110, 255) 76%, rgba(166, 23, 255, 1) 100%); margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otp}</h2>
                    <p style="font-size: 0.9em;">Regards,<br />Instant-Fix</p>
                    <hr style="border: none; border-top: 1px solid #eee" />
                </div>
            </div>`
   };

   try {
      await transporter.sendMail(mailOptions);
      console.log("OTP sent to mail");
      return true;
   } catch (error) {
      console.log("OTP not sent", error);
      return false;
   }
};

export default sendOTPmail;