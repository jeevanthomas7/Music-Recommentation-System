import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
} from "../controllers/favoriteController.js";

const router = express.Router();

router.post("/add", addToFavorites);
router.post("/remove", removeFromFavorites);
router.get("/user/:userId", getUserFavorites);

export default router;
