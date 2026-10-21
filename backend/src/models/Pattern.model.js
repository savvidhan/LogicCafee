import mongoose from "mongoose";

const PatternSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    // 🧠 NEW — theory fields
    keywords: {
      type: [String],
      default: [],
    },

    subPatterns: [
      {
        title: String,
        description: String,
      },
    ],

    whenToUse: {
      type: [String],
      default: [],
    },

    whenNotToUse: {
      type: [String],
      default: [],
    },

    codeTemplate: {
      type: String,
      default: "",
    },

    timeComplexity: { 
      type: String, 
      default: "" 
    },

    spaceComplexity: { 
      type: String, 
      default: "" 
    },
  },
  { timestamps: true }
);

/* ---- Indexes ---- */
PatternSchema.index({ name: "text", description: "text" });

export const Pattern = mongoose.model("Pattern", PatternSchema);
