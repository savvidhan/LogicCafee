/**
 * PatternCard
 * Clickable card showing pattern name, description, and progress bar.
 */
import { Link } from "react-router-dom";

const PatternCard = ({ pattern }) => {
  const { completedCount: done = 0, totalCount: total = 0 } = pattern;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Link
      to={`/patterns/${pattern._id}`}
      className="group flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-indigo-500/40 hover:bg-zinc-900"
    >
      {/* Name */}
      <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-400 transition">
        {pattern.name}
      </h3>

      {/* Description */}
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-500">
        {pattern.description}
      </p>

      <div className="flex-1" />

      {/* Progress bar — only shown when total > 0 */}
      {total > 0 && (
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-[10px] text-zinc-600">
            <span>{pct}% done</span>
            <span>{done}/{total}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 text-[10px] font-medium text-zinc-600 group-hover:text-indigo-400 transition">
        View pattern →
      </div>
    </Link>
  );
};

export default PatternCard;
