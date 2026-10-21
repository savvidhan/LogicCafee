import { Pattern } from "../../models/Pattern.model.js";
import ApiError from "../../utils/ApiError.js";

/**
 * Get all patterns (for the patterns list page)
 * Only returns fields needed for the card view
 */
export const getAllPatterns = async () => {
  return await Pattern.find()
    .select("name description createdAt")
    .sort({ createdAt: 1 })
    .lean();
};

/**
 * Get a single pattern with ALL fields (for the detail page)
 * This includes keywords, subPatterns, whenToUse, codeTemplate etc.
 */
export const getPatternById = async (patternId) => {
  // No .select() here — we need every field for the theory section
  const pattern = await Pattern.findById(patternId).lean();

  if (!pattern) {
    throw new ApiError(404, "Pattern not found");
  }

  return pattern;
};

/**
 * Create a pattern (used by seed script)
 */
export const createPattern = async (patternData) => {
  return await Pattern.create(patternData);
};
