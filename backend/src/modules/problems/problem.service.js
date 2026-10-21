import { Problem } from "../../models/Problem.model.js";
import { Pattern } from "../../models/Pattern.model.js";
import ApiError from "../../utils/ApiError.js";

/**
 * Create a new problem
 * Used for seeding / admin
 */
export const createProblem = async ( problemData ) => {
  return await Problem.create(problemData);
};

/**
 * Get all problems for a specific pattern
 * Used in Pattern Detail page
 * Returns: pattern + problems
 */
export const getProblemsByPattern = async ( patternId ) => {
  // Fetch pattern by ID with selected fields
  const pattern = await Pattern.findById(patternId)
    .select("name description")
    .lean();

  if (!pattern) {
    throw new ApiError(404, "Pattern not found");
  }

  // Fetch problems associated with the pattern
  const problems = await Problem.find({ pattern: patternId })
    .select("title difficulty leetcodeLink gfgLink order")
    .sort({ order: 1 })
    .lean();

  return {
    pattern,
    problems,
  };
};

/**
 * Get single problem by ID
 * Used in Problem Detail / Workspace
 */
export const getProblemById = async (problemId) => {

  // Fetch problem by ID with selected fields and populate pattern name
  const problem = await Problem.findById(problemId)
    .select("title difficulty description leetcodeLink gfgLink pattern")
    .populate("pattern", "name")
    .lean();

  // Handle case where problem is not found
  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  return problem;
};

/**
 * Get total problem count (GLOBAL)
 * Used for profile progress
 */
export const getProblemStats = async () => {
  // Count total number of problems in the database
  const totalProblems = await Problem.countDocuments();
  return { totalProblems };
};
