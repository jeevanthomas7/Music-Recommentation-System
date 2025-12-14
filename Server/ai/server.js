import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔹 TEMP SONG DATA (NO DB NEEDED)
const songs = [
  { id: 1, title: "Happy Vibes", artist: "DJ Smile", emotion: "happy", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Sad Piano", artist: "Melody Soul", emotion: "sad", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Chill Beats", artist: "LoFi Boy", emotion: "neutral", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: 4, title: "Energy Rock", artist: "Fire Band", emotion: "angry", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
];

// 🔹 TEST API
app.get("/", (req, res) => {
  res.send("Emotion Music API Running");
});

// 🔹 EMOTION → SONG RECOMMENDATION
app.post("/recommend", (req, res) => {
  const { emotion } = req.body;

  if (!emotion) {
    return res.status(400).json({ success: false, message: "Emotion required" });
  }

  const recommended = songs.filter(s => s.emotion === emotion);

  res.json({
    success: true,
    emotion,
    songs: recommended
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
