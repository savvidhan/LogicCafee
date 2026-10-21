import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import { Problem } from "../../models/Problem.model.js";
import { Pattern } from "../../models/Pattern.model.js";

/**
 * GET /api/search?q=sliding+window&type=all&difficulty=medium
 *
 * Search across problems and patterns using MongoDB text indexes.
 * type: "problems" | "patterns" | "all"  (default: "all")
 * difficulty: "easy" | "medium" | "hard" | undefined
 */
export const globalSearch = async (req, res, next) => {
  try {
    const { q, type = "all", difficulty } = req.query;

    if (!q || q.trim().length < 2) {
      throw new ApiError(400, "Search query must be at least 2 characters");
    }

    const query = q.trim();
    const results = { problems: [], patterns: [] };

    // Build problem search — text index + optional difficulty filter
    if (type === "all" || type === "problems") {
      const problemFilter = {
        $text: { $search: query },
      };
      if (difficulty && ["easy", "medium", "hard"].includes(difficulty)) {
        problemFilter.difficulty = difficulty;
      }

      results.problems = await Problem.find(problemFilter, {
        score: { $meta: "textScore" },
      })
        .select("title difficulty pattern leetcodeLink gfgLink topicTags")
        .populate("pattern", "name")
        .sort({ score: { $meta: "textScore" } })
        .limit(20)
        .lean();
    }

    // Pattern search — text index on name + description
    if (type === "all" || type === "patterns") {
      results.patterns = await Pattern.find(
        { $text: { $search: query } },
        { score: { $meta: "textScore" } }
      )
        .select("name description")
        .sort({ score: { $meta: "textScore" } })
        .limit(10)
        .lean();
    }

    const totalCount = results.problems.length + results.patterns.length;

    return res.status(200).json(
      new ApiResponse(200, { ...results, totalCount, query }, "Search results")
    );
  } catch (error) {
    next(error);
  }
};
