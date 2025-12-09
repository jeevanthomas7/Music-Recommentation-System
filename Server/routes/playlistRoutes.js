import express from "express";
import {
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getUserPlaylists,
  deletePlaylist
} from "../controllers/playlistController.js";

const router = express.Router();

router.post("/create", createPlaylist);
router.post("/add-song", addSongToPlaylist);
router.post("/remove-song", removeSongFromPlaylist);
router.get("/user/:userId", getUserPlaylists);
router.delete("/:playlistId", deletePlaylist);

export default router;
