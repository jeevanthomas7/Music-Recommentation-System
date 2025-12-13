import React, { useEffect, useState } from "react";
import { FiHeart, FiMusic, FiTrash2 } from "react-icons/fi";
import API from "../api/api";

function normalizeSong(s) {
  if (!s) return null;
  return {
    id: s._id,
    title: s.title,
    artist: Array.isArray(s.artist) ? s.artist.join(", ") : s.artist || "",
    cover: s.coverUrl || s.cover || s.image || "",
    url: s.audioUrl || s.audio || s.stream || ""
  };
}

export default function Sidebar({ user, onPlay }) {
  const [favourites, setFavourites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [openPlaylist, setOpenPlaylist] = useState(null);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    loadFavourites();
    loadPlaylists();

    const refetch = () => {
      loadFavourites();
      loadPlaylists();
    };

    window.addEventListener("dotin_playlists_changed", refetch);
    window.addEventListener("dotin_favourites_changed", refetch);

    return () => {
      window.removeEventListener("dotin_playlists_changed", refetch);
      window.removeEventListener("dotin_favourites_changed", refetch);
    };
  }, [userId]);

  async function loadFavourites() {
    const res = await API.get(`/favorites/user/${userId}`);
    setFavourites(res.data || []);
  }

  async function loadPlaylists() {
    const res = await API.get(`/playlists/user/${userId}`);
    setPlaylists(res.data || []);
  }

  async function removeFavourite(songId) {
    await API.post("/favorites/remove", { userId, songId });
    window.dispatchEvent(new Event("dotin_favourites_changed"));
  }

  async function deletePlaylist(id) {
    await API.delete(`/playlists/${id}`);
    window.dispatchEvent(new Event("dotin_playlists_changed"));
  }

  async function removeSong(plId, songId) {
    await API.post("/playlists/remove-song", { playlistId: plId, songId });
    window.dispatchEvent(new Event("dotin_playlists_changed"));
  }

  return (
<aside className="fixed top-16 bottom-20 left-0 w-80 hidden md:block">



      <div className="h-full bg-[#f9f9fb] rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden">

   
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Your Library</h2>
        </div>

     
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-800">
              <FiHeart className="text-pink-500" />
              Favourites
            </div>

            {favourites.length === 0 && (
              <div className="text-xs text-gray-400">No favourites yet</div>
            )}

            <div className="space-y-1">
              {favourites.map(f => (
                <div
                  key={f._id}
                  className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-100 text-sm"
                >
                  <span
                    onClick={() =>
                      onPlay?.([normalizeSong(f.songId)], 0)
                    }
                    className="truncate cursor-pointer text-gray-700 hover:text-black"
                  >
                    {f.songId?.title}
                  </span>
                  <FiTrash2
                    onClick={() => removeFavourite(f.songId._id)}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>


          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-800">
              <FiMusic />
              Playlists
            </div>

            {playlists.map(pl => (
              <div key={pl._id} className="mb-2">
                <div
                  onClick={() =>
                    setOpenPlaylist(openPlaylist === pl._id ? null : pl._id)
                  }
                  className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
                >
                  <span className="truncate text-sm text-gray-700">
                    {pl.name}
                  </span>
                  <FiTrash2
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(pl._id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  />
                </div>

                {openPlaylist === pl._id && (
                  <div className="ml-3 mt-1 space-y-1">
                    {pl.songs.map((s, i) => (
                      <div
                        key={s._id}
                        className="flex justify-between items-center px-2 py-1 rounded hover:bg-gray-100 text-xs"
                      >
                        <span
                          onClick={() =>
                            onPlay?.(pl.songs.map(normalizeSong), i)
                          }
                          className="truncate cursor-pointer text-gray-600 hover:text-black"
                        >
                          {s.title}
                        </span>
                        <FiTrash2
                          onClick={() => removeSong(pl._id, s._id)}
                          className="text-gray-400 hover:text-red-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </aside>
  );
}
