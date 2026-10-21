/**
 * Progress API — Pattern-wise progress
 * Only called when user is logged in (checked before request)
 */
import { getToken } from "./auth.service";
import api from "./api";

export const getPatternProgress = async () => {
  // Skip the API call if not logged in — return empty data silently
  if (!getToken()) return { success: true, data: [] };
  const res = await api.get("/progress/patterns");
  return res.data;
};
