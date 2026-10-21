import { Progress } from "../../models/Progress.model.js";
import { Problem } from "../../models/Problem.model.js";

/**
 * Create or update progress for a user & problem
 * - Handles solved / reviseLater / notes
 */
export const upsertProgress = async ({
  userId,
  problemId,
  solved,
  reviseLater,
  notes,
}) => {
  // Upsert progress document
  const progress = await Progress.findOneAndUpdate(
    { user: userId, problem: problemId },
    {
      solved,
      reviseLater,
      notes,
    },
    {
      new: true,
      upsert: true,
    }
  );

  return progress;
};

/**
 * Get all progress for logged-in user
 * - Used for dashboard & pattern progress
 */
export const getUserProgress = async (userId) => {

  // Fetch all progress entries for the user
  const progress = await Progress.find({ user: userId })
    .populate({
      path: "problem",
      select: "title difficulty pattern",
      populate: {
        path: "pattern",
        select: "name",
      },
    });

  return progress;
};

/**
 * Get pattern-wise progress for user
 */
export const getPatternProgressByUser = async (userId) => {

  // Fetch all solved progress entries for the user
  const solvedProgress = await Progress.find({
    user: userId,
    solved: true,
  }).populate({
    path: "problem",
    select: "pattern",
  });

  // Map to count solved problems per pattern
  const solvedMap = {};
  // Populate the map
  solvedProgress.forEach( ( entry ) => {
    // Get pattern ID from populated problem
    const patternId = entry.problem?.pattern?.toString();

    // Skip if no pattern ID
    if (!patternId) return;

    // Increment count for this pattern
    solvedMap[patternId] = (solvedMap[patternId] || 0) + 1;
  });

  // Aggregate total problems per pattern
  const totalByPattern = await Problem.aggregate([
    {
      $group: {
        _id: "$pattern",
        totalCount: { $sum: 1 },
      },
    },
  ]);

  // Combine total and solved counts
  const result = totalByPattern.map( ( item ) => ({
    patternId: item._id,
    completedCount: solvedMap[item._id?.toString()] || 0,
    totalCount: item.totalCount,
  }));

  return result;
};

/* ------------------------------------------------------------------ */
/* 📝 NOTES PER QUESTION HELPERS */
/* ------------------------------------------------------------------ */

/**
 * Get progress for a user & specific problem
 */
export const getProgressByUserAndProblem = async ({ userId, problemId }) => {
  // Fetch progress document for the user & problem
  return await Progress.findOne({
    user: userId,
    problem: problemId,
  });
};

/**
 * Save / update notes for a problem
 */
export const updateProblemNote = async ({
  userId,
  problemId,
  notes,
}) => {
  return await Progress.findOneAndUpdate(
    { user: userId, problem: problemId },
    { notes },
    { upsert: true, new: true }
  );
};
