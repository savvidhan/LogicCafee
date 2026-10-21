/** Problem API calls */
import api from "./api";

export const getProblemsByPattern = async (patternId) => {
  const res = await api.get(`/problems/pattern/${patternId}`);
  return res.data;
};
