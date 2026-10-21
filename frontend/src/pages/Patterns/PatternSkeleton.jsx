/** Loading skeleton for the patterns grid */
const PatternSkeleton = () => (
  <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
    <div className="mb-10 space-y-2">
      <div className="h-8 w-48 rounded-lg bg-zinc-800 animate-pulse" />
      <div className="h-4 w-72 rounded bg-zinc-800/60 animate-pulse" />
    </div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-36 rounded-xl border border-zinc-800 bg-zinc-900/60 animate-pulse" />
      ))}
    </div>
  </div>
);

export default PatternSkeleton;
