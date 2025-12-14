import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import cors from "cors";
import { connectDB } from "./config/db.js";
import albumRoutes from "./routes/albumRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import searchRoutes from "./routes/searchRoute.js";
import emotionRoutes from "./routes/emotionRoutes.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

const FRONTEND_ORIGIN ='https://dot-in.vercel.app' || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);


app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp"
  })
);



app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("WELCOME TO HOMEPAGE");
});

app.use("/api/albums", albumRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes)
app.use("/api/payments", paymentRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/emotion", emotionRoutes);


app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ message: err.message || "Server error" });
});


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
