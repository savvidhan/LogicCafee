/**
 * ProblemList
 * Groups problems by difficulty (easy → medium → hard)
 * and renders a ProblemRow for each.
 */
import ProblemRow from "./ProblemRow";

const DIFFICULTY_ORDER = ["easy", "medium", "hard"];

const DIFFICULTY_COLORS = {
  easy:   "text-emerald-400",
  medium: "text-amber-400",
  hard:   "text-red-400",
};

const ProblemList = ({ problems, onToggle }) => {
  // Group problems by difficulty
  const grouped = { easy: [], medium: [], hard: [] };
  problems.forEach((p) => {
    if (grouped[p.difficulty]) grouped[p.difficulty].push(p);
  });

  const hasAny = problems.length > 0;

  if (!hasAny) {
    return (
      <p className="text-sm text-zinc-500">No problems found for this pattern.</p>
    );
  }

  return (
    <div className="space-y-10">
      {DIFFICULTY_ORDER.map((level) => {
        const list = grouped[level];
        if (!list.length) return null;

        return (
          <section key={level}>
            {/* Section header */}
            <div className="mb-4 flex items-center gap-3">
              <h2 className={`text-base font-semibold capitalize ${DIFFICULTY_COLORS[level]}`}>
                {level}
              </h2>
              <span className="text-xs text-zinc-600">
                {list.length} problem{list.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Problem rows */}
            <div className="space-y-2">
              {list.map((problem) => (
                <ProblemRow
                  key={problem._id}
                  problem={problem}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProblemList;
