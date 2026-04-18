import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import { sendEmail } from "../../services/email.service.js";
import { SALT_ROUND } from "../../config/config.service.js";

// SIGNUP
export const signup = async (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const existingUser = await User.findOne({ email });

  // generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, SALT_ROUND);

  // hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

  // verified user
  if (existingUser && existingUser.isVerified) {
    throw new Error("Email already exists");
  }

  // user exists but not verified resend OTP
  if (existingUser && !existingUser.isVerified) {
    existingUser.otp = hashedOtp;

    existingUser.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await existingUser.save();
  } else {
    // create new user
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
    });
  }

  // send email
  await sendEmail(
    email,
    "Verify your account",
    `Your OTP is ${otp}. It expires in 5 minutes.`
  );

  return { message: "Check your email for OTP" };
};

// VERIFY OTP
export const verifyOtp = async (req) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  
  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  const valid = await bcrypt.compare(otp, user.otp);
  if (!valid) throw new Error("Invalid OTP");

  user.isVerified = true;
  user.otp = null;
  user.otpExpiresAt = null;

  await user.save();

  return { message: "Account verified" };
};

// LOGIN
export const login = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  // unverified users
  if (!user.isVerified) {
    throw new Error("Please verify your account first");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
};