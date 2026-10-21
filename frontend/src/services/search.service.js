/** Global search API */
import api from "./api";

export const search = async (query, type = "all") => {
  const res = await api.get("/search", { params: { q: query, type } });
  return res.data?.data;
};
