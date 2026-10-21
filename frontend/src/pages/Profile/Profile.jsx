/**
 * Profile Page — Dashboard
 * Shows user info, overall progress ring,
 * difficulty breakdown, and weekly bar chart.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../../app/providers/AppProvider";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";

// ── Small reusable helpers ─────────────────────────────────────────

const Section = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 md:p-6 ${className}`}
  >
    {children}
  </motion.div>
);

const SectionTitle = ({ children }) => (
  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">{children}</p>
);

const StatBox = ({ label, value, color = "text-zinc-100" }) => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
    <p className="text-xs text-zinc-500">{label}</p>
    <p className={`mt-1 text-2xl font-bold tracking-tight ${color}`}>{value}</p>
  </div>
);

const Ring = ({ pct, size = 108, stroke = 8 }) => {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="currentColor" strokeWidth={stroke} className="text-zinc-800" />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="currentColor" strokeWidth={stroke} className="text-indigo-500"
        strokeDasharray={circ}
        strokeDashoffset={circ - (pct / 100) * circ}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
};

const DiffBar = ({ label, count, total }) => {
  const pct    = total > 0 ? Math.round((count / total) * 100) : 0;
  const colors = { easy: "bg-emerald-500", medium: "bg-amber-500", hard: "bg-red-500" };
  const texts  = { easy: "text-emerald-400", medium: "text-amber-400", hard: "text-red-400" };
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className={`capitalize font-medium ${texts[label]}`}>{label}</span>
        <span className="text-zinc-400">{count}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full rounded-full transition-all duration-700 ${colors[label]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const WeeklyBars = ({ data = [] }) => {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex h-20 items-end gap-1">
      {data.map((d, i) => {
        const h = Math.max((d.count / max) * 100, d.count > 0 ? 6 : 2);
        return (
          <div key={i} className="group relative flex flex-1 flex-col items-center justify-end">
            <div
              className="w-full rounded-t-sm bg-indigo-500/60 transition-all group-hover:bg-indigo-400"
              style={{ height: `${h}%` }}
            />
            {d.count > 0 && (
              <div className="pointer-events-none absolute bottom-full mb-0.5 hidden rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300 group-hover:block">
                {d.count}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Main Profile component ─────────────────────────────────────────

const Profile = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    api.get("/profile/summary")
      .then((res) => { if (!cancelled) setProfile(res.data?.data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [user]);

  if (loading) return <Loader label="Loading dashboard…" />;

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-400">
        Unable to load profile. Please refresh.
      </div>
    );
  }

  const { user: pu, account, progress, quickStats, weeklyActivity } = profile;

  const displayName = pu?.name || pu?.email?.split("@")[0] || "User";
  const initials    = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const pct         = progress?.overallProgressPercentage ?? 0;
  const diffTotal   = (quickStats?.easySolved || 0) + (quickStats?.mediumSolved || 0) + (quickStats?.hardSolved || 0);

  return (
    <div className="page-container py-10 space-y-5">

      {/* ── Header card ── */}
      <Section className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          {pu?.avatarUrl ? (
            <img src={pu.avatarUrl} alt={displayName}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-indigo-500/30" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/20 text-xl font-bold text-indigo-400">
              {initials}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-zinc-100">{displayName}</h1>
            <p className="text-sm text-zinc-500">{pu?.email}</p>
            <p className="mt-1 text-xs text-zinc-600">
              Joined {new Date(account?.accountCreatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
      </Section>

      {/* Progress ring + stat boxes */}
      <Section className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative">
            <Ring pct={pct} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-zinc-100">{pct}%</span>
              <span className="text-[10px] text-zinc-500">done</span>
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            {progress?.solvedProblems} / {progress?.totalProblems} solved
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBox label="Solved"   value={progress?.solvedProblems}   color="text-indigo-400" />
          <StatBox label="Pending"  value={progress?.pendingProblems}  color="text-amber-400" />
          <StatBox label="Review"   value={progress?.revisionProblems} color="text-violet-400" />
          <StatBox label="Patterns" value={quickStats?.patternsCount}  color="text-emerald-400" />
        </div>
      </Section>

      {/* Difficulty breakdown */}
      <Section>
        <SectionTitle>Difficulty breakdown</SectionTitle>
        <div className="space-y-3">
          <DiffBar label="easy"   count={quickStats?.easySolved}   total={diffTotal} />
          <DiffBar label="medium" count={quickStats?.mediumSolved} total={diffTotal} />
          <DiffBar label="hard"   count={quickStats?.hardSolved}   total={diffTotal} />
        </div>
      </Section>

      {/* Weekly bar chart */}
      <Section>
        <SectionTitle>Last 12 weeks</SectionTitle>
        <WeeklyBars data={weeklyActivity || []} />
      </Section>

      {/* Next action */}
      <Section>
        <SectionTitle>What&apos;s next?</SectionTitle>
        <p className="mb-4 text-sm text-zinc-400">
          {progress?.pendingProblems > 0
            ? <>You have <span className="font-semibold text-zinc-200">{progress.pendingProblems}</span> unsolved problems. Aim for at least one today.</>
            : "You've solved everything 🎉 Consider revisiting flagged problems."}
        </p>
        <button onClick={() => navigate("/patterns")}
          className="rounded-lg bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400 hover:bg-indigo-500/20 transition">
          Browse patterns →
        </button>
      </Section>

      {/* Sign out */}
      <div className="flex justify-end">
        <button onClick={() => { logout(); navigate("/login"); }}
          className="rounded-lg border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition">
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Profile;
