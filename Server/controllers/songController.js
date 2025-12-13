import { Song } from "../models/Song.js";

export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 12 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          album: 1,
          genre: 1,
          duration: 1,
          coverUrl: 1,        // ← consistent
          audioUrl: 1,        // ← consistent
          createdAt: 1,
        }
      }
    ]);
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 12 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          album: 1,
          genre: 1,
          duration: 1,
          coverUrl: 1,
          audioUrl: 1,
          createdAt: 1,
        }
      }
    ]);
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 12 } },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          album: 1,
          genre: 1,
          duration: 1,
          coverUrl: 1,
          audioUrl: 1,
          createdAt: 1,
        }
      }
    ]);
    res.json(songs);
  } catch (error) {
    next(error);
  }
};