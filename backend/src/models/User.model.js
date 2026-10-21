import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, default: null },

    googleId:     { type: String, default: null, sparse: true },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    avatarUrl:    { type: String, default: null },

    isEmailVerified: { type: Boolean, default: false },
    otp:             { type: String, default: null },
    otpExpiresAt:    { type: Date, default: null },
  },
  { timestamps: true }
);

// No schema.index() — unique:true and sparse:true above already create the indexes.
// Adding them again causes the "Duplicate schema index" warning.

export const User = mongoose.model("User", userSchema);
