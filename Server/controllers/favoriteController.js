import Favorite from "../models/Favourite.js";
import {Song} from "../models/Song.js";

export const addToFavorites = async (req, res) => {
  try {
    const { userId, songId } = req.body;

    if (!userId || !songId) {
      return res.status(400).json({ message: "userId and songId required" });
    }

    const exists = await Favorite.findOne({ userId, songId });
    if (exists) {
      return res.status(200).json(exists);
    }

    const fav = await Favorite.create({ userId, songId });
    res.status(201).json(fav);
  } catch (e) {
    res.status(500).json({ message: "Failed to add favorite" });
  }
};


export const removeFromFavorites = async (req, res) => {
  try {
    const { userId, songId } = req.body;

    await Favorite.deleteOne({ userId, songId });
    res.json({ message: "Removed from favorites" });
  } catch {
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    const favs = await Favorite.find({ userId }).populate("songId");
    res.json(favs);
  } catch {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};