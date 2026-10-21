import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import {
  sendRegistrationOTP,
  verifyOTPAndRegister,
  loginUser,
  handleGoogleAuth,
} from "./auth.service.js";
import { env } from "../../config/env.js";

/**
 * POST /api/auth/register/send-otp
 * Step 1: Validate user info, send OTP
 */
export const sendOTP = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const result = await sendRegistrationOTP({ name, email, password });

    return res.status(200).json(
      new ApiResponse(200, result, "OTP sent to your email")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/register/verify-otp
 * Step 2: Verify OTP and create account
 */
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new ApiError(400, "Email and OTP are required");
    }

    const result = await verifyOTPAndRegister({ email, otp });

    return res.status(201).json(
      new ApiResponse(201, result, "Account created successfully")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const result = await loginUser({ email, password });

    return res.status(200).json(
      new ApiResponse(200, result, "Login successful")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/google
 * Initiates Google OAuth (handled by Passport)
 */
export const googleAuth = (req, res) => {
  // This is handled by passport middleware in routes
};

/**
 * GET /api/auth/google/callback
 * Called by Google after OAuth — generate JWT and redirect to frontend
 */
export const googleCallback = async (req, res, next) => {
  try {
    const result = handleGoogleAuth(req.user);

    // Redirect to frontend with token in query param
    // Frontend will read it from URL and store in localStorage
    const redirectUrl = `${env.CLIENT_URL}/auth/callback?token=${result.token}&user=${encodeURIComponent(JSON.stringify(result.user))}`;

    res.redirect(redirectUrl);
  } catch (error) {
    next(error);
  }
};

