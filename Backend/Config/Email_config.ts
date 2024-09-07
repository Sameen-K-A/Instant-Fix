import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendOTPmail = async (email: string, otp: string): Promise<boolean> => {
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: process.env.ServerEmail as string,
         pass: process.env.ServerPassword as string,
      },
   });

   const mailOptions = {
      from: process.env.ServerEmail as string,
      to: email,
      subject: 'Instant-Fix OTP Verification',
      html: `
      <div style="font-family: Helvetica, Arial, sans-serif; min-width: 100px; overflow: auto; line-height: 2">
        <div style="margin: 50px auto; width: 70%; padding: 20px 0">
          <p style="font-size: 1.1em">Hi,</p>
          <p>This message is from Instant-Fix. Use the following OTP to complete your registration procedures. OTP is valid for two minutes.</p>
          <h2 style="background: linear-gradient(90deg, rgba(87, 67, 66, 1) 14%, rgba(31, 20, 20, 1) 68%, rgba(57, 36, 36, 1) 100%); margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otp}</h2>
          <p style="font-size: 0.9em;">Regards,<br />Instant-Fix</p>
          <hr style="border: none; border-top: 1px solid #eee" />
        </div>
      </div>
    `,
   };

   try {
      await transporter.sendMail(mailOptions);
      console.log("OTP sent to email");
      return true;
   } catch (error) {
      console.error("Error in sending OTP email:", error);
      return false;
   }
};

export default sendOTPmail;