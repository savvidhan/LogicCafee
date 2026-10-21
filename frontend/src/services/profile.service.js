/** Profile API */
import api from "./api";

export const getProfileSummary = async () => {
  const res = await api.get("/profile/summary");
  return res.data?.data;
};
