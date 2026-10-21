import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Generate JWT token
 * Used during login / signup
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN || "7d",
    }
  );
};

/**
 * Verify JWT token
 * Used in auth middleware
 */
export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
