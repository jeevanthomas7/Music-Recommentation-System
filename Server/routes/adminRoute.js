import { Router } from "express";
import {
  checkAdmin,
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
  getUsers,
  updateAlbum,
  updateSong,
  getPremiumUsers
} from "../controllers/adminController.js";

import { auth, admin } from "../middleware/authMiddileware.js";

const router = Router();

router.use(auth, admin);

router.get("/check", checkAdmin);
router.get("/users", getUsers);
router.get("/premium-users", getPremiumUsers);

router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);
router.put("/song/:id", updateSong);

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);
router.put("/album/:id", updateAlbum);

export default router;
