import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const sendOTP = async (email, otp) => {
  try {
    // 1. Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 2. Verify the transporter
    await transporter.verify();
    console.log('✅ Transporter verified');

    // 3. Prepare email details
    const mailOptions = {
      from: `"Timesheet App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP code is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
    };

    // 4. Send the email
    const info = await transporter.sendMail(mailOptions);
console.log('📨 OTP sent:', info.response);
console.log('Accepted:', info.accepted);
console.log('Rejected:', info.rejected);
    console.log('📨 OTP sent:', info);

  } catch (error) {
    console.error('❌ Error sending OTP:', error);
  }
};
