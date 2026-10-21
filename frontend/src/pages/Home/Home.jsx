import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPatterns } from "../../services/pattern.service";

const FEATURES = [
  { icon: "⬡", color: "text-indigo-400",  title: "Learn by Pattern",      desc: "21 patterns — learn one, recognise it in many problems." },
  { icon: "◎", color: "text-violet-400",  title: "Focused Practice",       desc: "Generate targeted sessions. Unsolved problems come first." },
  { icon: "✎", color: "text-emerald-400", title: "Notes per Problem",      desc: "Write insights and edge cases. Auto-saved to your account." },
  { icon: "⊙", color: "text-cyan-400",    title: "Progress Dashboard",     desc: "Difficulty breakdown, weekly chart, and overall progress." },
];

const PatternStrip = () => {
  const [patterns, setPatterns] = useState([]);
  useEffect(() => {
    getPatterns().then(r => setPatterns(r?.data || [])).catch(() => {});
  }, []);
  if (!patterns.length) return null;
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-widest text-zinc-600">All 21 patterns covered</p>
      <div className="flex flex-wrap gap-2">
        {patterns.map(p => (
          <Link key={p._id} to={`/patterns/${p._id}`}
            className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-300">
            {p.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

const Home = () => (
  <div className="page-container py-16 space-y-20">

    {/* ── Hero ─────────────────────────────────────── */}
    <div className="max-w-2xl">
      <h1 className="text-4xl font-bold leading-tight tracking-tight text-zinc-100 md:text-5xl">
        Master DSA by <span className="text-indigo-400">patterns</span>,<br />
        not by memorising problems.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-400">
        LogicCafe organises every DSA problem by the pattern behind it.
        Learn the pattern once — recognise it everywhere.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/patterns"
          className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400">
          Explore patterns →
        </Link>
        <Link to="/register"
          className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100">
          Create free account
        </Link>
      </div>
    </div>

    {/* ── Stats ────────────────────────────────────── */}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[["21","Patterns"],["180+","Problems"],["4","Features"],["Free","Forever"]].map(([v,l]) => (
        <div key={l} className="rounded-xl border border-zinc-800 bg-zinc-900/40 py-5 text-center">
          <p className="text-2xl font-bold text-indigo-400">{v}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{l}</p>
        </div>
      ))}
    </div>

    {/* ── Features ─────────────────────────────────── */}
    <div>
      <h2 className="mb-6 text-lg font-semibold text-zinc-100">What you get</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon, color, title, desc }) => (
          <div key={title} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <span className={`text-xl ${color}`}>{icon}</span>
            <h3 className="mt-3 text-sm font-semibold text-zinc-100">{title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* ── Pattern strip ────────────────────────────── */}
    <PatternStrip />

    {/* ── CTA ──────────────────────────────────────── */}
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-8 py-12 text-center">
      <h2 className="text-xl font-bold text-zinc-100">Ready to start?</h2>
      <p className="mt-2 text-sm text-zinc-500">Free account · No credit card · All 21 patterns unlocked immediately.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/register"
          className="rounded-lg bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400">
          Get started
        </Link>
        <Link to="/patterns"
          className="rounded-lg border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-600">
          Browse without signing up
        </Link>
      </div>
    </div>

  </div>
);

export default Home;
