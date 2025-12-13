import Playlist from "../models/Playlist.js";
import {Song} from "../models/Song.js";

export const createPlaylist = async (req, res) => {
  try {
    const { userId, name } = req.body;

    const playlist = await Playlist.create({
      userId,
      name,
      songs: []
    });

    res.status(201).json(playlist);
  } catch {
    res.status(500).json({ message: "failed to create playlist" });
  }
};

export const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "playlist not found" });

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: "song already in playlist" });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.json(playlist);
  } catch {
    res.status(500).json({ message: "failed to add song" });
  }
};

export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "playlist not found" });

    playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
    await playlist.save();

    res.json(playlist);
  } catch {
    res.status(500).json({ message: "failed to remove song" });
  }
};

export const getUserPlaylists = async (req, res) => {
  try {
    const { userId } = req.params;

    const playlists = await Playlist.find({ userId }).populate("songs");
    res.json(playlists);
  } catch {
    res.status(500).json({ message: "failed to fetch playlists" });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    await Playlist.findByIdAndDelete(playlistId);
    res.json({ message: "playlist deleted" });
  } catch {
    res.status(500).json({ message: "failed to delete playlist" });
  }
};