/** Pattern API calls */
import api from "./api";

export const getPatterns = async () => {
  const res = await api.get("/patterns");
  return res.data;
};

export const getPatternById = async (patternId) => {
  const res = await api.get(`/patterns/${patternId}`);
  return res.data;
};
