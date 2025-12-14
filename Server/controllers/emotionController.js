import { Song } from "../models/Song.js";

export const recommendByEmotion = async (req, res) => {
  try {
    const { emotion } = req.body;

    if (!emotion) {
      return res.status(400).json({ success: false, message: "Emotion required" });
    }

 
   const emotionMap = {
      happy: ["happy", "pop"],
      sad: ["sad", "melody"],
      angry: ["rock", "rap"],
      neutral: ["lofi", "chill"]
    };

    const genres = emotionMap[emotion] || [emotion];

    const songs = await Song.find({
      genre: { $in: genres }
    }).limit(20);

    res.json({ success: true, songs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
