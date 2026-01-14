import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("dotin_user"));

  useEffect(() => {
    if (!user?.id) return;
    API.get(`/playlists/user/${user.id}`).then(res => {
      setPlaylists(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.play();
    }
  }, [currentSong]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Your Playlists
          </h1>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/");
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border rounded-lg hover:bg-green-500 transition bg-green-400"
          >
            <FaArrowLeft />
            Back To Home
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {!activePlaylist ? (
          playlists.length === 0 ? (
            <div className="text-center text-gray-500 mt-24">
              No playlists available
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {playlists.map(pl => {
                const cover =
                  pl.songs.find(s => s.coverUrl)?.coverUrl ||
                  "/playlist-default.png";

                return (
                  <div
                    key={pl._id}
                    onClick={() => setActivePlaylist(pl)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden"
                  >
                    <img
                      src={cover}
                      alt={pl.name}
                      className="w-full aspect-square object-cover"
                    />

                    <div className="p-3">
                      <div className="font-semibold text-sm truncate">
                        {pl.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {pl.songs.length} songs
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <>
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => setActivePlaylist(null)}
                className="text-sm px-3 py-1.5 border rounded-lg  "
              >
                ← Back To Playlists
              </button>

              <h2 className="text-lg font-semibold truncate">
                {activePlaylist.name}
              </h2>
            </div>

            <div className="space-y-3">
              {activePlaylist.songs
                .filter(s => s.audioUrl)
                .map(song => (
                  <div
                    key={song._id}
                    onClick={() => setCurrentSong(song)}
                    className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition"
                  >
                    <img
                      src={song.coverUrl}
                      className="w-12 h-12 object-cover rounded-md"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {song.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {song.artist}
                      </div>
                    </div>

                    <FaPlay className="text-emerald-600" />
                  </div>
                ))}
            </div>
          </>
        )}

        {currentSong && (
          <div className="mt-8 bg-white rounded-xl shadow p-4">
            <div className="text-sm font-medium mb-2 truncate">
              Now Playing: {currentSong.title} – {currentSong.artist}
            </div>
            <audio ref={audioRef} controls className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
