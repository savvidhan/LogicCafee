import express from "express";
import passport from "../../config/passport.js";
import { sendOTP, verifyOTP, login, googleCallback } from "./auth.controller.js";
import { authLimiter, otpLimiter } from "../../middlewares/rateLimit.middleware.js";
import { env } from "../../config/env.js";

const router = express.Router();

/* ── Local auth with OTP ── */
router.post("/register/send-otp", otpLimiter, sendOTP);
router.post("/register/verify-otp", authLimiter, verifyOTP);
router.post("/login", authLimiter, login);

/* ── Google OAuth ── */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      const redirectUrl =
        (env.CLIENT_URL || "http://localhost:5173") + "/login?error=oauth_failed";
      return res.redirect(redirectUrl);
    }
    req.user = user;
    return googleCallback(req, res, next);
  })(req, res, next);
});

export default router;
