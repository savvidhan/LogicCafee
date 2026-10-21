/**
 * PatternDetail Page
 * Shows pattern theory (description, keywords, code template)
 * followed by the list of problems grouped by difficulty.
 */
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getPatternById } from "../../services/pattern.service";
import { getProblemsByPattern } from "../../services/problem.service";
import { getCompletedProblems } from "../../services/progress.service";
import PatternTheory from "./PatternTheory";
import ProblemList from "./ProblemList";

const PatternDetail = () => {
  const { patternId } = useParams();

  // Key that changes when patternId changes — forces re-fetch
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    data: patternRes,
    loading: patternLoading,
    error: patternError,
  } = useFetch(
    () => getPatternById(patternId),
    `pattern-${patternId}`,   // unique cache key per pattern
    [patternId]               // re-fetch when patternId changes
  );

  const {
    data: problemsRes,
    loading: problemsLoading,
    error: problemsError,
  } = useFetch(
    () => getProblemsByPattern(patternId),
    `problems-${patternId}`,
    [patternId]
  );

  // pattern and problems come from the API response data field
  const pattern  = patternRes?.data  || null;
  const problems = problemsRes?.data?.problems || [];

  // Compute progress bar values — recalculates when problems load or user toggles
  const progress = useMemo(() => {
    const solved = getCompletedProblems();
    const total  = problems.length;
    const done   = problems.filter((p) => solved.includes(p._id)).length;
    return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
  }, [problems, refreshKey]);

  // ── Loading state ──
  if (patternLoading || problemsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-400" />
          <p className="text-sm text-zinc-500">Loading…</p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (patternError || problemsError || !pattern) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-red-400">
          {patternError || problemsError || "Pattern not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="page-container py-12">

      {/* ── Pattern theory cards ── */}
      <PatternTheory pattern={pattern} />

      {/* ── Progress bar ── */}
      <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-zinc-400">Your progress</span>
          <span className="font-medium text-zinc-100">
            {progress.done} / {progress.total} solved
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${progress.pct}%` }}
          />
        </div>
        <p className="mt-1.5 text-right text-xs text-zinc-600">{progress.pct}%</p>
      </div>

      {/* ── Problems grouped by difficulty ── */}
      <ProblemList
        problems={problems}
        onToggle={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
};

export default PatternDetail;
