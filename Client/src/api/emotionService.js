import API from "./api";

export const getEmotionRecommendations = async (emotion) => {
  const res = await API.post("/emotion", { emotion });
  return res.data;
};
