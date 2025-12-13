import express from "express";
import { getMe, googleAuth, logout } from "../controllers/authController.js";
import { auth } from "../middleware/authMiddileware.js";

const router = express.Router();

router.post("/google", googleAuth);
router.post("/logout", logout);
router.get("/me", auth, getMe);

export default router;
