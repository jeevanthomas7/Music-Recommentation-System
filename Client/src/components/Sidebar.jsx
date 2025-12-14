import React, { useEffect, useState } from "react";
import { FiHeart, FiMusic, FiTrash2, FiX } from "react-icons/fi";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const [confirm, setConfirm] = useState(null);

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

  function askConfirm(message, action) {
    setConfirm({ message, action });
  }

  async function confirmYes() {
    if (confirm?.action) await confirm.action();
    setConfirm(null);
  }

  function confirmNo() {
    setConfirm(null);
  }

  const SidebarContent = (
    <div className="h-full bg-[#f9f9fb] rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Your Library</h2>
        <button className="md:hidden" onClick={() => setMobileOpen(false)}>
          <FiX />
        </button>
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
                className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100"
              >
                <div
                  onClick={() => onPlay?.([normalizeSong(f.songId)], 0)}
                  className="flex items-center gap-2 cursor-pointer min-w-0"
                >
                  <img
                    src={f.songId?.coverUrl}
                    className="w-8 h-8 rounded object-cover bg-gray-200"
                  />
                  <span className="truncate text-sm text-gray-700 hover:text-black">
                    {f.songId?.title}
                  </span>
                </div>

                <FiTrash2
                  onClick={() =>
                    askConfirm(
                      `Remove "${f.songId.title}" from favourites?`,
                      async () => {
                        await API.post("/favorites/remove", {
                          userId,
                          songId: f.songId._id
                        });
                        window.dispatchEvent(new Event("dotin_favourites_changed"));
                      }
                    )
                  }
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
                    askConfirm(
                      `Delete playlist "${pl.name}"?`,
                      async () => {
                        await API.delete(`/playlists/${pl._id}`);
                        window.dispatchEvent(
                          new Event("dotin_playlists_changed")
                        );
                      }
                    );
                  }}
                  className="text-gray-400 hover:text-red-500"
                />
              </div>

              {openPlaylist === pl._id && (
                <div className="ml-2 mt-1 space-y-1">
                  {pl.songs.map((s, i) => (
                    <div
                      key={s._id}
                      className="flex items-center justify-between gap-2 px-2 py-1 rounded hover:bg-gray-100"
                    >
                      <div
                        onClick={() =>
                          onPlay?.(pl.songs.map(normalizeSong), i)
                        }
                        className="flex items-center gap-2 cursor-pointer min-w-0"
                      >
                        <img
                          src={s.coverUrl}
                          className="w-7 h-7 rounded object-cover bg-gray-200"
                        />
                        <span className="truncate text-xs text-gray-600 hover:text-black">
                          {s.title}
                        </span>
                      </div>

                      <FiTrash2
                        onClick={() =>
                          askConfirm(
                            `Remove "${s.title}" from playlist?`,
                            async () => {
                              await API.post("/playlists/remove-song", {
                                playlistId: pl._id,
                                songId: s._id
                              });
                              window.dispatchEvent(
                                new Event("dotin_playlists_changed")
                              );
                            }
                          )
                        }
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
  );

  return (
    <>
      <aside className="fixed top-16 bottom-20 left-0 w-80 hidden md:block">
        {SidebarContent}
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 bottom-24 z-40 md:hidden bg-black text-white px-4 py-2 rounded-full shadow-lg"
      >
        Library
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="w-80 h-full">{SidebarContent}</div>
          <div
            className="flex-1 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-80 p-5">
            <div className="text-sm font-medium text-gray-800 mb-4">
              {confirm.message}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={confirmNo}
                className="px-4 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmYes}
                className="px-4 py-1 rounded text-sm bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
