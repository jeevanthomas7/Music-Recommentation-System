import { useState } from "react";
import EmotionDetector from "../components/EmotionDetector";
import MoodPlaylist from "../components/MoodPlaylist";

export default function AiCamera() {
  const [songs, setSongs] = useState([]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">AI Mood Detection 🎭</h1>

      <EmotionDetector onSongs={setSongs} />

      {songs.length > 0 && <MoodPlaylist songs={songs} />}
    </div>
  );
}
