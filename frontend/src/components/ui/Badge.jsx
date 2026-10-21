/**
 * Badge — shows difficulty level or a custom text label
 * Usage: <Badge level="easy" />  or  <Badge text="🔥 streak" />
 */
import clsx from "clsx";

const LEVEL_STYLES = {
  easy:   "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  medium: "border-amber-500/30   bg-amber-500/10   text-amber-400",
  hard:   "border-red-500/30     bg-red-500/10     text-red-400",
};

const Badge = ({ level, text }) => {
  const base = "inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium";

  if (level) {
    return (
      <span className={clsx(base, "capitalize", LEVEL_STYLES[level] || "border-zinc-700 text-zinc-400")}>
        {level}
      </span>
    );
  }

  if (text) {
    return (
      <span className={clsx(base, "border-zinc-700 bg-zinc-800/60 text-zinc-300")}>
        {text}
      </span>
    );
  }

  return null;
};

export default Badge;
