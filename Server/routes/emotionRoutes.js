import express from "express";
import { recommendByEmotion } from "../controllers/emotionController.js";

const router = express.Router();

router.post("/", recommendByEmotion);

export default router;
