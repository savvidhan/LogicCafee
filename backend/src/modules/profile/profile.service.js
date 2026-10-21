import { User } from "../../models/User.model.js";
import { Progress } from "../../models/Progress.model.js";
import { Problem } from "../../models/Problem.model.js";
import ApiError from "../../utils/ApiError.js";

export const getProfileSummaryService = async (userId) => {

  /* ── Run all independent DB queries in PARALLEL ── */
  const [user, progressEntries, totalProblems, patternIds] = await Promise.all([
    User.findById(userId).lean(),
    Progress.find({ user: userId }).lean(),
    Problem.countDocuments(),
    Problem.distinct("pattern"),
  ]);

  if (!user) throw new ApiError(404, "User not found");

  /* ── Split progress entries ── */
  const solvedEntries   = progressEntries.filter((p) => p.solved);
  const revisionEntries = progressEntries.filter((p) => p.reviseLater);
  const solvedProblemIds = solvedEntries.map((p) => p.problem);

  /* ── Difficulty breakdown ── */
  const solvedProblems = solvedProblemIds.length
    ? await Problem.find(
        { _id: { $in: solvedProblemIds } },
        { difficulty: 1 }
      ).lean()
    : [];

  const easySolved   = solvedProblems.filter((p) => p.difficulty === "easy").length;
  const mediumSolved = solvedProblems.filter((p) => p.difficulty === "medium").length;
  const hardSolved   = solvedProblems.filter((p) => p.difficulty === "hard").length;

  /* ── Activity heatmap — last 365 days ── */
  const heatmapData = buildHeatmap(solvedEntries);

  /* ── Weekly activity (last 12 weeks) ── */
  const weeklyActivity = buildWeeklyActivity(solvedEntries);

  return {
    user: {
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
      authProvider: user.authProvider || "local",
    },

    account: {
      accountCreatedAt: user.createdAt,
      lastActiveAt: user.updatedAt,
    },

    progress: {
      totalProblems,
      solvedProblems: solvedEntries.length,
      pendingProblems: totalProblems - solvedEntries.length,
      revisionProblems: revisionEntries.length,
      overallProgressPercentage:
        totalProblems === 0
          ? 0
          : Number(((solvedEntries.length / totalProblems) * 100).toFixed(2)),
    },

    quickStats: {
      patternsCount: patternIds.length,
      easySolved,
      mediumSolved,
      hardSolved,
    },

    heatmap: heatmapData,
    weeklyActivity,
  };
};

/* ────────────────────────────────────────────── */
/* Heatmap helpers                                */
/* ────────────────────────────────────────────── */

/**
 * Build a GitHub-style daily activity map for the last 365 days.
 * Returns: { "2025-01-15": 3, "2025-01-20": 1, ... }
 */
function buildHeatmap(solvedEntries) {
  const map = {};
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 1);

  for (const entry of solvedEntries) {
    const date = new Date(entry.updatedAt);
    if (date < cutoff) continue;

    const key = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
    map[key] = (map[key] || 0) + 1;
  }

  return map;
}

/**
 * Build weekly solved counts for the last 12 weeks.
 * Returns: [{ week: "2025-W01", count: 5 }, ...]
 */
function buildWeeklyActivity(solvedEntries) {
  const weeks = {};
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 84); // 12 weeks

  for (const entry of solvedEntries) {
    const date = new Date(entry.updatedAt);
    if (date < cutoff) continue;

    const weekKey = getWeekKey(date);
    weeks[weekKey] = (weeks[weekKey] || 0) + 1;
  }

  // Fill in missing weeks with 0
  const result = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    const key = getWeekKey(d);
    result.push({ week: key, count: weeks[key] || 0 });
  }

  return result;
}

function getWeekKey(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // start of week (Sunday)
  return d.toISOString().split("T")[0];
}
