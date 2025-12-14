import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/api";
import { FiMusic } from "react-icons/fi";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setSongs([]);
      setAlbums([]);
      return;
    }

    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const res = await API.get(`/search?q=${encodeURIComponent(q)}`);
        if (!mounted) return;

        setSongs(res.data?.songs || []);
        setAlbums(res.data?.albums || []);
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [q]);

  return (
    <div className="px-4 md:px-6 pt-4 pb-28">

      <h1 className="text-2xl font-bold mb-6">
        Results for “{q}”
      </h1>

      {loading && (
        <div className="text-gray-400 mb-6">Searching...</div>
      )}

      
      {songs.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-3">Songs</h2>

          <div className="space-y-2">
            {songs.map(s => (
              <div
                key={s._id}
                className="flex items-center gap-3 p-3 bg-white
                           rounded-lg shadow-sm hover:bg-gray-50"
              >
                <FiMusic className="text-gray-400" />

                <div className="min-w-0">
                  <div className="font-semibold truncate">
                    {s.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {Array.isArray(s.artist)
                      ? s.artist.join(", ")
                      : s.artist}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

     
      {albums.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-3">Albums</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {albums.map(a => (
              <div
                key={a._id}
                className="bg-white rounded-xl p-3
                           shadow-sm hover:shadow-md transition"
              >
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={a.coverUrl}
                    alt={a.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mt-2 font-semibold truncate">
                  {a.title}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {a.artist}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && songs.length === 0 && albums.length === 0 && (
        <div className="text-gray-400 text-center mt-20">
          No results found
        </div>
      )}
    </div>
  );
}
