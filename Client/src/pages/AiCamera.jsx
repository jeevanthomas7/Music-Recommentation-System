import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmotionDetector from "../components/EmotionDetector";
import MoodPlaylist from "../components/MoodPlaylist";
import PlayerBar from "./AiPlayerBar";

export default function AiCamera() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const navigate = useNavigate();

  const backHome = () => {
    window.dispatchEvent(new Event("STOP_CAMERA"));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b">
        <h1 className="text-xl font-semibold text-gray-800">
          AI Mood Detection
        </h1>
        <button
          onClick={backHome}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-black"
        >
          ← Back to Home
        </button>
      </div>

      <div className="p-6 grid gap-6 md:grid-cols-2">
        <EmotionDetector onSongs={setSongs} />
        <MoodPlaylist songs={songs} onPlay={setCurrentSong} />
      </div>

      {currentSong && <PlayerBar song={currentSong} />}
    </div>
  );
}
