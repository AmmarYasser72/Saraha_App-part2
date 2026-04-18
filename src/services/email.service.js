import nodemailer from "nodemailer";

// create transporter ONCE (better performance)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// generic email sender
export const sendEmail = async (to, subject, text) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

// OTP-specific email
export const sendOTPEmail = async (email, otp) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your account",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });
};
