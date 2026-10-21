/** Centered spinner with optional label */
const Loader = ({ label = "Loading…" }) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
    <div className="h-9 w-9 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-400" />
    <p className="text-sm text-zinc-500">{label}</p>
  </div>
);

export default Loader;
