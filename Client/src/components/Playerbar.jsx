import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiShuffle,
  FiRepeat,
  FiHeart,
  FiPlus,
  FiList,
  FiVolume2,
  FiX
} from "react-icons/fi";
import API from "../api/api.js";

export default function PlayerBar({ playlist = [], initialIndex = 0 }) {
  const audioRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const [favourites, setFavourites] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [showQueue, setShowQueue] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("dotin_user"));
    } catch {
      return null;
    }
  }, []);

  const userId = user?.id;

  const current = playlist.length ? playlist[index] : null;

  /* 🔥 FIX 1: RESET INDEX WHEN PLAYLIST CHANGES */
  useEffect(() => {
    if (!playlist.length) return;
    const safeIndex = Math.min(initialIndex, playlist.length - 1);
    setIndex(safeIndex);
  }, [playlist, initialIndex]);

  /* 🔥 FIX 2: FORCE AUDIO LOAD */
  useEffect(() => {
    if (!current?.url || !audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.src = current.url;
    audioRef.current.load();

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [current?.url]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    loadFavourites();
    loadPlaylists();
  }, [userId]);

  async function loadFavourites() {
    if (!userId) return;
    const res = await API.get(`/favorites/user/${userId}`);
    const map = {};
    (res.data || []).forEach(f => (map[f.songId._id] = true));
    setFavourites(map);
  }

  async function loadPlaylists() {
    if (!userId) return;
    const res = await API.get(`/playlists/user/${userId}`);
    setPlaylists(res.data || []);
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  function next() {
    if (!playlist.length) return;
    if (shuffle) {
      setIndex(Math.floor(Math.random() * playlist.length));
    } else if (index < playlist.length - 1) {
      setIndex(index + 1);
    } else if (loop) {
      setIndex(0);
    }
  }

  function prev() {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      setIndex(index > 0 ? index - 1 : playlist.length - 1);
    }
  }

  async function toggleFavourite() {
    if (!current || !userId) return;
    const songId = current.id;

    if (favourites[songId]) {
      await API.post("/favorites/remove", { userId, songId });
      setFavourites(f => {
        const n = { ...f };
        delete n[songId];
        return n;
      });
    } else {
      await API.post("/favorites/add", { userId, songId });
      setFavourites(f => ({ ...f, [songId]: true }));
    }

    window.dispatchEvent(new Event("dotin_favourites_changed"));
  }

  async function addToPlaylist(id) {
    await API.post("/playlists/add-song", {
      playlistId: id,
      songId: current.id
    });
    setShowAdd(false);
    window.dispatchEvent(new Event("dotin_playlists_changed"));
  }

  async function createAndAdd(e) {
    e.preventDefault();
    if (!newPlaylist.trim()) return;

    const res = await API.post("/playlists/create", {
      userId,
      name: newPlaylist
    });

    await API.post("/playlists/add-song", {
      playlistId: res.data._id,
      songId: current.id
    });

    setNewPlaylist("");
    setShowAdd(false);
    loadPlaylists();
    window.dispatchEvent(new Event("dotin_playlists_changed"));
  }

  function format(t) {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <>
     
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="h-20 px-6 flex items-center gap-4">

       
          <div className="hidden md:flex items-center gap-3 w-[320px]">
            <img src={current?.cover} className="w-14 h-14 rounded bg-gray-200 object-cover" />
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">
                {current?.title || "Not playing"}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {current?.artist}
              </div>
            </div>

            <FiHeart
              onClick={toggleFavourite}
              className={`cursor-pointer ${
                favourites[current?.id] ? "text-pink-500" : "text-gray-400"
              }`}
            />

            <FiPlus
              onClick={() => setShowAdd(true)}
              className="cursor-pointer text-gray-400 hover:text-black"
            />
          </div>

          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center gap-4">
              <FiShuffle onClick={() => setShuffle(!shuffle)} className={shuffle ? "text-green-500" : "text-gray-400"} />
              <FiSkipBack onClick={prev} />
              <button onClick={togglePlay} className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                {isPlaying ? <FiPause /> : <FiPlay />}
              </button>
              <FiSkipForward onClick={next} />
              <FiRepeat onClick={() => setLoop(!loop)} className={loop ? "text-green-500" : "text-gray-400"} />
            </div>

            <div className="flex items-center gap-2 w-full max-w-xl text-xs mt-1">
              <span>{format(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={e => {
                  audioRef.current.currentTime =
                    duration * (e.target.value / 100);
                }}
                className="flex-1"
              />
              <span>{format(duration)}</span>
            </div>
          </div>


          <div className="hidden md:flex items-center gap-3 w-[240px] justify-end">
            <FiList onClick={() => setShowQueue(true)} />
            <FiVolume2 />
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(e.target.value)} />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          setCurrentTime(audioRef.current.currentTime);
          setDuration(audioRef.current.duration || 0);
          setProgress(
            (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0
          );
        }}
        onEnded={next}
      />

     
      {showQueue && (
        <div className="fixed right-6 bottom-24 z-50 w-80 bg-white rounded-xl shadow-lg border">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="font-semibold">Queue</div>
            <FiX className="cursor-pointer" onClick={() => setShowQueue(false)} />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {playlist.map((s, i) => (
              <div
                key={s.id}
                onClick={() => setIndex(i)}
                className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
                  i === index ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <img src={s.cover} className="w-10 h-10 rounded object-cover bg-gray-200" />
                <div className="min-w-0">
                  <div className="text-sm truncate">{s.title}</div>
                  <div className="text-xs text-gray-500 truncate">{s.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-96 p-5">
            <div className="flex justify-between mb-3">
              <div className="font-semibold">Add to playlist</div>
              <FiX className="cursor-pointer" onClick={() => setShowAdd(false)} />
            </div>

            <form onSubmit={createAndAdd} className="flex gap-2 mb-3">
              <input
                value={newPlaylist}
                onChange={e => setNewPlaylist(e.target.value)}
                className="flex-1 border px-3 py-2 rounded text-sm"
                placeholder="Create playlist"
              />
              <button className="bg-black text-white px-3 rounded">Create</button>
            </form>

            {playlists.map(pl => (
              <button
                key={pl._id}
                onClick={() => addToPlaylist(pl._id)}
                className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-sm"
              >
                {pl.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
