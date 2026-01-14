import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Favorites() {
  const [songs, setSongs] = useState([]);
  const [current, setCurrent] = useState(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("dotin_user"));

  useEffect(() => {
    if (!user?.id) return;

    API.get(`/favorites/user/${user.id}`).then(res => {
      setSongs(res.data || []);
    });
  }, []);

  useEffect(() => {
    if (current && audioRef.current) {
      audioRef.current.src = current.audioUrl;
      audioRef.current.play();
    }
  }, [current]);

  return (
    <div className="min-h-screen bg-gray-50">

   
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Your Favourites
          </h1>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/");
            }}
            className="
              flex items-center gap-2
              px-4 py-2
              text-sm font-medium
              text-gray-700
              bg-green-400
              border rounded-lg
              hover:bg-green-500
              transition
            "
          >
            <FaArrowLeft />
           Back To Home
          </button>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto p-6">

        {songs.length === 0 ? (
          <div className="text-center text-gray-500 mt-24">
            No favourite songs yet 🎶
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {songs.map(f => {
              const song = f.songId;

              return (
                <div
                  key={f._id}
                  onClick={() => setCurrent(song)}
                  className="
                    group bg-white rounded-xl shadow-sm
                    hover:shadow-lg transition cursor-pointer
                  "
                >
                  
                  <div className="relative">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-full aspect-square object-cover rounded-t-xl"
                    />

                   
                    <div
                      className="
                        absolute inset-0 flex items-center justify-center
                        bg-black/40 opacity-0 group-hover:opacity-100
                        transition
                      "
                    >
                      <div className="bg-emerald-500 p-4 rounded-full text-white">
                        <FaPlay size={18} />
                      </div>
                    </div>
                  </div>

              
                  <div className="p-3">
                    <div className="font-semibold text-sm truncate">
                      {song.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {song.artist}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {current && (
          <div className="mt-8 bg-white rounded-xl shadow p-4">
            <div className="text-sm font-medium mb-2 truncate">
              Now Playing: {current.title} – {current.artist}
            </div>
            <audio ref={audioRef} controls className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
