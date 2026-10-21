/**
 * Practice Page
 * Lets users pick patterns and generate a focused practice session.
 * Prioritizes unsolved problems first.
 */
import { useState, useMemo, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { getPatterns } from "../../services/pattern.service";
import { getProblemsByPattern } from "../../services/problem.service";
import { getCompletedProblems } from "../../services/progress.service";
import Loader from "../../components/ui/Loader";
import Badge from "../../components/ui/Badge";

// Shuffles an array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generates a practice set prioritising unsolved, then medium → easy → hard
function buildSession(problems, solved, count) {
  if (!problems.length) return [];
  const unsolved = problems.filter((p) => !solved.includes(p._id));
  const pool     = unsolved.length ? unsolved : problems;

  const buckets = { medium: [], easy: [], hard: [] };
  pool.forEach((p) => buckets[p.difficulty]?.push(p));

  const ordered = [
    ...shuffle(buckets.medium),
    ...shuffle(buckets.easy),
    ...shuffle(buckets.hard),
  ];
  return ordered.slice(0, count);
}

// ── Sub-components ─────────────────────────────────────────────────

const Step = ({ num, title, desc, children }) => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
    <div>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400">Step {num}</span>
      <h2 className="mt-0.5 text-sm font-semibold text-zinc-200">{title}</h2>
      <p className="text-xs text-zinc-500">{desc}</p>
    </div>
    {children}
  </div>
);

const ResultCard = ({ problem }) => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-zinc-100">{problem.title}</p>
        <p className="mt-1 text-xs text-zinc-500">{problem.patternName}</p>
      </div>
      <Badge level={problem.difficulty} />
    </div>
    <div className="mt-3 flex gap-2">
      {problem.leetcodeLink && (
        <a href={problem.leetcodeLink} target="_blank" rel="noopener noreferrer"
          className="rounded border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:text-orange-400 hover:border-orange-500/40 transition">
          LeetCode
        </a>
      )}
      {problem.gfgLink && (
        <a href={problem.gfgLink} target="_blank" rel="noopener noreferrer"
          className="rounded border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:text-green-400 hover:border-green-500/40 transition">
          GFG
        </a>
      )}
    </div>
  </div>
);

// ── Main component ─────────────────────────────────────────────────

const Practice = () => {
  const { data: patternsRes, loading } = useFetch(getPatterns, "patterns");
  const patterns = patternsRes?.data ?? [];

  const [selected, setSelected]   = useState([]); // selected pattern IDs
  const [count, setCount]         = useState(3);   // session size
  const [allProblems, setAllProblems] = useState([]);
  const [fetching, setFetching]   = useState(false);
  const [session, setSession]     = useState([]);

  // Build patternId → name map for enriching problems
  const patternMap = useMemo(() => {
    const m = {};
    patterns.forEach((p) => { m[p._id] = p.name; });
    return m;
  }, [patterns]);

  // Fetch problems whenever pattern selection changes
  useEffect(() => {
    if (!selected.length) { setAllProblems([]); return; }
    setFetching(true);
    Promise.all(selected.map((id) => getProblemsByPattern(id)))
      .then((responses) => {
        const problems = responses.flatMap((r) => r.data?.problems || []);
        setAllProblems(problems);
      })
      .catch(() => setAllProblems([]))
      .finally(() => setFetching(false));
  }, [selected]);

  const togglePattern = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const generate = () => {
    const enriched = allProblems.map((p) => ({ ...p, patternName: patternMap[p.pattern] || "—" }));
    setSession(buildSession(enriched, getCompletedProblems(), count));
  };

  if (loading) return <Loader label="Loading patterns…" />;

  return (
    <div className="page-container py-12 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Practice Session</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Pick patterns, set a size, and get a focused set of problems to practice.
        </p>
      </div>

      {/* Step 1 — Choose patterns */}
      <Step num="01" title="Choose Patterns" desc="Select the patterns you want to practice.">
        <div className="flex flex-wrap gap-2">
          {patterns.map((p) => (
            <button key={p._id} onClick={() => togglePattern(p._id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                selected.includes(p._id)
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
              }`}>
              {p.name}
            </button>
          ))}
        </div>
        {selected.length > 0 && (
          <p className="text-xs text-zinc-500">{selected.length} pattern{selected.length > 1 ? "s" : ""} selected</p>
        )}
      </Step>

      {/* Step 2 — Session size */}
      <Step num="02" title="Session Size" desc="How many problems for this session?">
        <div className="flex gap-2">
          {[3, 5, 7, 10].map((n) => (
            <button key={n} onClick={() => setCount(n)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                count === n
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
              }`}>
              {n}
            </button>
          ))}
        </div>
      </Step>

      {/* Step 3 — Generate */}
      <Step num="03" title="Generate" desc="Problems are sorted by priority — unsolved first.">
        <button
          onClick={generate}
          disabled={!selected.length || fetching}
          className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40 transition"
        >
          {fetching ? "Preparing…" : "Generate Practice Set"}
        </button>
        {!selected.length && (
          <p className="text-xs text-zinc-600">Select at least one pattern first.</p>
        )}
      </Step>

      {/* Results */}
      {session.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-300">
            Your session — {session.length} problems
          </p>
          {session.map((p) => <ResultCard key={p._id} problem={p} />)}
          <button onClick={generate}
            className="text-xs text-indigo-400 hover:underline">
            ↺ Regenerate
          </button>
        </div>
      )}

      {/* Empty state after generate with no problems */}
      {session.length === 0 && selected.length > 0 && !fetching && (
        <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center">
          <p className="text-sm text-zinc-500">Click &ldquo;Generate Practice Set&rdquo; to begin.</p>
        </div>
      )}
    </div>
  );
};

export default Practice;
