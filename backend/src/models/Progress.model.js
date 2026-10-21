import mongoose from "mongoose";

/**
 * Progress Schema
 * - Tracks user progress per problem
 * - MVP: solved / reviseLater
 */
const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },

    solved: {
      type: Boolean,
      default: false,
    },

    reviseLater: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: "",
    },

    solvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/* ---- Indexes ---- */
// Most queried: user's progress lookup
progressSchema.index({ user: 1, problem: 1 }, { unique: true });
// Pattern progress aggregation
progressSchema.index({ user: 1, solved: 1 });
// Streak calculation (updatedAt)
progressSchema.index({ user: 1, updatedAt: -1 });

export const Progress = mongoose.model("Progress", progressSchema);
