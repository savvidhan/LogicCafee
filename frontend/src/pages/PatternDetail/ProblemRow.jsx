/**
 * ProblemRow
 * A single problem with:
 * - Checkbox to mark solved
 * - Difficulty badge
 * - LeetCode / GFG links
 * - Notes textarea (collapsible, auto-saved)
 */
import { useEffect, useState } from "react";
import Badge from "../../components/ui/Badge";
import {
  isProblemCompleted,
  toggleProblem,
  getProblemNote,
  saveProblemNote,
} from "../../services/progress.service";

const ProblemRow = ({ problem, onToggle }) => {
  const [solved, setSolved]     = useState(() => isProblemCompleted(problem._id));
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes]         = useState("");

  // Load note when panel opens
  useEffect(() => {
    if (!showNotes) return;
    getProblemNote(problem._id).then((note) => setNotes(note || ""));
  }, [showNotes, problem._id]);

  // Auto-save note 600ms after user stops typing
  useEffect(() => {
    if (!showNotes) return;
    const timer = setTimeout(() => saveProblemNote(problem._id, notes), 600);
    return () => clearTimeout(timer);
  }, [notes, showNotes, problem._id]);

  const handleToggle = () => {
    toggleProblem(problem._id);
    setSolved((prev) => !prev);
    onToggle?.();
  };

  const openNotes = () => setShowNotes((v) => !v);

  return (
    <div className={`rounded-xl border transition-colors ${
      solved ? "border-zinc-800/50 bg-zinc-900/30" : "border-zinc-800 bg-zinc-900/60"
    }`}>
      <div className="px-4 py-3">

        {/* ── Main row ── */}
        <div className="flex items-start justify-between gap-4">

          {/* Left: checkbox + title + tags */}
          <div className="flex items-start gap-3">
            {/* Custom checkbox */}
            <button
              onClick={handleToggle}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                solved
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-zinc-600 hover:border-indigo-400"
              }`}
            >
              {solved && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            <div>
              <p className={`text-sm font-medium ${solved ? "text-zinc-500 line-through" : "text-zinc-100"}`}>
                {problem.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Badge level={problem.difficulty} />
                {problem.topicTags?.map((tag) => (
                  <span key={tag} className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: links + action buttons */}
          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            {problem.leetcodeLink && (
              <a href={problem.leetcodeLink} target="_blank" rel="noopener noreferrer"
                className="rounded border border-zinc-700/60 px-2 py-1 text-xs text-zinc-400 hover:border-orange-500/40 hover:text-orange-400 transition">
                LC
              </a>
            )}
            {problem.gfgLink && (
              <a href={problem.gfgLink} target="_blank" rel="noopener noreferrer"
                className="rounded border border-zinc-700/60 px-2 py-1 text-xs text-zinc-400 hover:border-green-500/40 hover:text-green-400 transition">
                GFG
              </a>
            )}

            {/* Notes button */}
            <button onClick={openNotes}
              className={`rounded border px-2 py-1 text-xs font-medium transition ${
                showNotes
                  ? "border-violet-500/50 bg-violet-500/10 text-violet-400"
                  : "border-zinc-700/60 text-zinc-400 hover:text-violet-400"
              }`}>
              📝 Notes
            </button>
          </div>
        </div>

        {/* ── Notes panel ── */}
        {showNotes && (
          <div className="mt-3 border-t border-zinc-800 pt-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">My Notes</span>
              <span className="text-[10px] text-zinc-700">Auto-saved</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write insights, edge cases, mistakes to avoid…"
              rows={4}
              className="w-full resize-none rounded-lg border border-zinc-700/60 bg-zinc-800/40 p-3 text-xs leading-relaxed text-zinc-300 placeholder-zinc-600 focus:border-violet-500/40 focus:outline-none transition"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemRow;
