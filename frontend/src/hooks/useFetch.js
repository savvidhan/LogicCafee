/**
 * useFetch — simple data-fetching hook with in-memory cache
 *
 * Usage:
 *   const { data, loading, error } = useFetch(fetchFn, "cache-key", [dep]);
 *
 * - fetchFn   : async function that returns data
 * - cacheKey  : string key — omit to disable caching
 * - deps      : array — re-fetches when any dep changes (like useEffect)
 */
import { useEffect, useState } from "react";

// Module-level cache — persists across re-renders but clears on page refresh
const cache = new Map();

const useFetch = (fetchFn, cacheKey, deps = []) => {
  const cached = cacheKey ? cache.get(cacheKey) : undefined;

  const [data, setData]       = useState(cached ?? null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;

    // Serve from cache immediately — no loading flash
    if (cacheKey && cache.has(cacheKey)) {
      setData(cache.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchFn()
      .then((result) => {
        if (cancelled) return;
        if (cacheKey) cache.set(cacheKey, result);
        setData(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.message || err?.message || "Something went wrong");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
};

export default useFetch;
