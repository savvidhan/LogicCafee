import bcrypt from "bcryptjs";
import { User } from "../../models/User.model.js";
import { generateToken } from "../../utils/jwt.js";
import { generateOTP, sendOTPEmail } from "../../utils/mailer.js";
import ApiError from "../../utils/ApiError.js";

/* ------------------------------------------------------------------ */
/* LOCAL AUTH                                                           */
/* ------------------------------------------------------------------ */

/**
 * Step 1 of registration: send OTP to email
 */
export const sendRegistrationOTP = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  // Check if email already registered and verified
  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.isEmailVerified) {
    throw new ApiError(409, "Email already registered");
  }

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  const hashedPassword = await bcrypt.hash(password, 10);

  if (existingUser) {
    // Update existing unverified record
    existingUser.name = name;
    existingUser.password = hashedPassword;
    existingUser.otp = otp;
    existingUser.otpExpiresAt = otpExpiresAt;
    await existingUser.save();
  } else {
    // Create pending user
    await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt,
      isEmailVerified: false,
    });
  }

  await sendOTPEmail({ to: email, otp, name });

  return { message: "OTP sent to your email" };
};

/**
 * Step 2 of registration: verify OTP and activate account
 */
export const verifyOTPAndRegister = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const user = await User.findOne({ email });

  if (!user || user.isEmailVerified) {
    throw new ApiError(400, "Invalid request");
  }

  if (user.otp !== otp) {
    throw new ApiError(400, "Incorrect OTP");
  }

  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new ApiError(400, "OTP has expired. Please request a new one");
  }

  // Activate account
  user.isEmailVerified = true;
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  const token = generateToken(user._id);

  return {
    user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
    token,
  };
};

/**
 * Login user (email + password)
 */
export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // OAuth-only user trying to use password login
  if (!user.password) {
    throw new ApiError(400, "This account uses Google login. Please sign in with Google");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(user._id);

  return {
    user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
    token,
  };
};

/* ------------------------------------------------------------------ */
/* GOOGLE OAUTH                                                         */
/* ------------------------------------------------------------------ */

/**
 * Generate JWT after successful Google OAuth
 * (Called after passport verifies the Google token)
 */
export const handleGoogleAuth = (user) => {
  const token = generateToken(user._id);
  return {
    user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
    token,
  };
};

