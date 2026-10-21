/**
 * Progress Service
 * ----------------
 * Single source of truth for problem progress.
 * - Stores solved problem IDs in localStorage for instant UI
 * - Syncs to backend when user is logged in
 */
import { getToken } from "./auth.service";
import api from "./api";

const STORAGE_KEY = "lc_progress_v1";

// ── localStorage helpers ──────────────────────────────────────────

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { solved: [] };
  } catch {
    return { solved: [] };
  }
}

function writeLocal(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Public API ────────────────────────────────────────────────────

/** Returns true if this problem is marked solved locally */
export const isProblemCompleted = (problemId) =>
  readLocal().solved.includes(problemId);

/** Returns the full list of solved problem IDs */
export const getCompletedProblems = () => readLocal().solved;

/**
 * Toggle solved state for a problem.
 * Updates localStorage immediately, then syncs to backend.
 */
export const toggleProblem = (problemId) => {
  const data = readLocal();
  const idx  = data.solved.indexOf(problemId);

  if (idx === -1) {
    data.solved.push(problemId);   // mark solved
  } else {
    data.solved.splice(idx, 1);    // unmark
  }

  writeLocal(data);

  // Sync to backend (fire and forget — don't block the UI)
  if (getToken()) {
    api.post("/progress", {
      problemId,
      solved: idx === -1, // true = just marked solved, false = unmarked
    }).catch(() => {}); // silent fail — local state is source of truth
  }
};

/**
 * Load progress from backend after login.
 * Overwrites local state with backend data.
 * Throws on 401 so AppProvider can clear stale tokens.
 */
export const hydrateProgressFromBackend = async () => {
  if (!getToken()) return;

  const res  = await api.get("/progress/me"); // throws 401 if token invalid
  const list = res.data?.data || [];

  const solved = list
    .filter((p) => p.solved)
    .map((p) => p.problem?._id || p.problem);

  writeLocal({ solved });
};

// ── Notes ─────────────────────────────────────────────────────────

/** Get saved note for a problem */
export const getProblemNote = async (problemId) => {
  if (!getToken()) return "";
  try {
    const res = await api.get(`/progress/problem/${problemId}/note`);
    return res.data?.data || "";
  } catch {
    return "";
  }
};

/** Save a note for a problem (debounced on the caller side) */
export const saveProblemNote = async (problemId, notes) => {
  if (!getToken()) return;
  try {
    await api.post(`/progress/problem/${problemId}/note`, { notes });
  } catch {}
};
