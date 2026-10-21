/**
 * Patterns Page
 * Shows all 21 DSA patterns as cards with progress bars.
 */
import useFetch from "../../hooks/useFetch";
import { getPatterns } from "../../services/pattern.service";
import { getPatternProgress } from "../../services/progress.api";
import PatternCard from "./PatternCard";
import PatternSkeleton from "./PatternSkeleton";

const Patterns = () => {
  // Fetch patterns (public) and progress (skipped if not logged in)
  const { data: patternsRes, loading: pLoad, error } = useFetch(getPatterns, "patterns");
  const { data: progressRes, loading: prLoad }       = useFetch(getPatternProgress, "pattern-progress");

  if (pLoad || prLoad) return <PatternSkeleton />;

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-red-400">Failed to load patterns. Please refresh.</p>
      </div>
    );
  }

  const patterns  = patternsRes?.data  || [];
  const progress  = progressRes?.data  || [];

  // Build a map of patternId → { completedCount, totalCount }
  const progressMap = {};
  progress.forEach((item) => { progressMap[item.patternId] = item; });

  // Merge progress into each pattern
  const merged = patterns.map((p) => ({
    ...p,
    completedCount: progressMap[p._id]?.completedCount ?? 0,
    totalCount:     progressMap[p._id]?.totalCount     ?? 0,
  }));

  return (
    <div className="page-container py-16">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-100">DSA Patterns</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Master the pattern once, recognize it in many problems.
        </p>
        <p className="mt-1 text-xs text-zinc-600">{merged.length} patterns available</p>
      </div>

      {/* Grid */}
      {merged.length === 0 ? (
        <p className="text-sm text-zinc-500">No patterns found. Run the seed script.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {merged.map((pattern) => (
            <PatternCard key={pattern._id} pattern={pattern} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Patterns;
