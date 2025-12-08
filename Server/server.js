import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import cloudinary from "./config/cloudinary.js";
import albumRoutes from "./routes/albumRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WELCOME TO HOMEPAGE");
});

app.use("/api/albums", albumRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes)



app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
