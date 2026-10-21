/**
 * Navbar
 * - Logo + nav links
 * - Live search with debounce (shows problems + patterns)
 * - Generic profile icon when logged in (no username shown)
 * - Mobile hamburger menu
 */
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../../app/providers/AppProvider";
import { search } from "../../services/search.service";

// Debounce hook — delays the value by `delay` ms after last change
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const DIFF_STYLES = {
  easy:   "text-emerald-400",
  medium: "text-amber-400",
  hard:   "text-red-400",
};

// Generic person/user SVG icon
const PersonIcon = () => (
  <svg className="h-4 w-4 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);

const Navbar = () => {
  const { isLoggedIn, logout } = useApp();
  const navigate = useNavigate();

  // Search state
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState(null);
  const [searching, setSearching] = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const searchRef                 = useRef(null);
  const debouncedQuery            = useDebounce(query, 350);

  // Mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  // Run search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults(null);
      setDropOpen(false);
      return;
    }
    let active = true;
    setSearching(true);
    search(debouncedQuery)
      .then((data) => {
        if (!active) return;
        setResults(data);
        setDropOpen(true);
      })
      .catch(() => {})
      .finally(() => { if (active) setSearching(false); });
    return () => { active = false; };
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleResultClick = (path) => {
    setQuery("");
    setDropOpen(false);
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const hasResults =
    results && (results.problems?.length > 0 || results.patterns?.length > 0);

  // Active link style
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-indigo-400" : "text-zinc-400 hover:text-zinc-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur">
      <div className="page-container flex h-16 items-center gap-5">

        {/* Logo */}
        <Link to="/" className="shrink-0 text-base font-bold text-white">
          Logic<span className="text-indigo-400">Cafe</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/patterns" className={linkClass}>Patterns</NavLink>
          <NavLink to="/practice" className={linkClass}>Practice</NavLink>
        </nav>

        {/* Search bar — flex-1 so it fills all remaining space */}
        <div ref={searchRef} className="relative hidden flex-1 md:block">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-700/70 bg-zinc-800/50 px-3 py-2 focus-within:border-indigo-500/60">
            {/* Search icon */}
            <svg className="h-3.5 w-3.5 shrink-0 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => hasResults && setDropOpen(true)}
              placeholder="Search problems & patterns…"
              className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none"
            />
            {searching && (
              <div className="h-3 w-3 shrink-0 animate-spin rounded-full border border-zinc-600 border-t-indigo-400" />
            )}
            {query && !searching && (
              <button onClick={() => { setQuery(""); setDropOpen(false); }} className="text-zinc-600 hover:text-zinc-400">
                ✕
              </button>
            )}
          </div>

          {/* Search dropdown */}
          {dropOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-72 overflow-y-auto rounded-xl border border-zinc-700/80 bg-zinc-900 shadow-2xl">
              {!hasResults ? (
                <p className="px-4 py-5 text-center text-xs text-zinc-500">
                  No results for &ldquo;{query}&rdquo;
                </p>
              ) : (
                <>
                  {/* Pattern results */}
                  {results.patterns?.length > 0 && (
                    <div>
                      <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                        Patterns
                      </p>
                      {results.patterns.map((p) => (
                        <button key={p._id}
                          onClick={() => handleResultClick(`/patterns/${p._id}`)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-800">
                          <span className="text-indigo-400 text-sm">⬡</span>
                          <div>
                            <p className="text-sm text-zinc-200">{p.name}</p>
                            <p className="line-clamp-1 text-xs text-zinc-500">{p.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Problem results */}
                  {results.problems?.length > 0 && (
                    <div className={results.patterns?.length ? "border-t border-zinc-800" : ""}>
                      <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                        Problems
                      </p>
                      {results.problems.map((p) => (
                        <button key={p._id}
                          onClick={() => handleResultClick(`/patterns/${p.pattern?._id || p.pattern}`)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-2.5 hover:bg-zinc-800">
                          <div className="min-w-0">
                            <p className="truncate text-sm text-zinc-200">{p.title}</p>
                            <p className="text-xs text-zinc-500">{p.pattern?.name}</p>
                          </div>
                          <span className={`shrink-0 text-[10px] font-semibold capitalize ${DIFF_STYLES[p.difficulty]}`}>
                            {p.difficulty}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Auth area (desktop) — ml-auto pushes it to the far right */}
        <div className="hidden items-center gap-3 md:flex ml-auto">
          {!isLoggedIn ? (
            <>
              <NavLink to="/login" className="text-sm text-zinc-400 hover:text-zinc-200 transition">
                Sign in
              </NavLink>
              <NavLink to="/register"
                className="rounded-lg bg-indigo-500 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400 transition">
                Get started
              </NavLink>
            </>
          ) : (
            <NavLink to="/profile"
              className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 transition">
              <PersonIcon />
            </NavLink>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="ml-auto rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 pb-5 pt-3 md:hidden">

          {/* Mobile search */}
          <div ref={searchRef} className="relative mb-3">
            <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none"
              />
            </div>
            {dropOpen && hasResults && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-56 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl">
                {results.patterns?.map((p) => (
                  <button key={p._id} onClick={() => handleResultClick(`/patterns/${p._id}`)}
                    className="flex w-full items-center gap-3 px-4 py-3 hover:bg-zinc-800">
                    <span className="text-sm text-zinc-200">{p.name}</span>
                  </button>
                ))}
                {results.problems?.map((p) => (
                  <button key={p._id}
                    onClick={() => handleResultClick(`/patterns/${p.pattern?._id || p.pattern}`)}
                    className="flex w-full items-center justify-between px-4 py-3 hover:bg-zinc-800">
                    <span className="text-sm text-zinc-200">{p.title}</span>
                    <span className={`text-[10px] capitalize ${DIFF_STYLES[p.difficulty]}`}>{p.difficulty}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile nav */}
          <nav className="flex flex-col gap-1">
            {[
              { to: "/", label: "Home", end: true },
              { to: "/patterns", label: "Patterns" },
              { to: "/practice", label: "Practice" },
            ].map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? "bg-indigo-500/10 text-indigo-400" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`
                }>
                {label}
              </NavLink>
            ))}

            {isLoggedIn ? (
              <>
                <NavLink to="/profile" onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? "bg-indigo-500/10 text-indigo-400" : "text-zinc-400 hover:bg-zinc-800"
                    }`
                  }>
                  Profile
                </NavLink>
                <button onClick={handleLogout}
                  className="mt-1 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-400 hover:bg-red-500/10 transition">
                  Sign out
                </button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <NavLink to="/login" onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-center text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition">
                  Sign in
                </NavLink>
                <NavLink to="/register" onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg bg-indigo-500 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-400 transition">
                  Register
                </NavLink>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
