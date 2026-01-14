import React, { useEffect, useState } from "react";
import API from "../api/api.js";
import { FiPlay } from "react-icons/fi";

function Card({ img, title, subtitle, onPlay }) {
  return (
    <div className="min-w-[160px] sm:min-w-[176px]">
      <div className="relative group rounded-xl overflow-hidden bg-[#0f0f0f]
        shadow-[0_6px_18px_rgba(59,130,246,0.08)]
        hover:shadow-[0_10px_30px_rgba(59,130,246,0.18)]
        transition">
        <div className="w-full aspect-square bg-gray-800">
          {img ? (
            <img src={img} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
          )}
        </div>

        <button
          onClick={onPlay}
          className="absolute right-3 bottom-3 w-9 h-9 rounded-full
          bg-white text-black flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition shadow-md"
        >
          <FiPlay />
        </button>
      </div>

      <div className="mt-3">
        <div className="text-sm font-semibold truncate">{title}</div>
        {subtitle && <div className="text-xs text-gray-400 truncate">{subtitle}</div>}
      </div>
    </div>
  );
}

function normalizeTrack(t) {
  if (!t) return null;
  return {
    id: t._id || t.id,
    title: t.title || t.name || "",
    artist: Array.isArray(t.artist) ? t.artist.join(", ") : t.artist || "",
    cover: t.coverUrl || t.cover || t.image || "",
    url: t.audioUrl || t.audio || t.stream || ""
  };
}

function normalizeList(res, key) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res[key] && Array.isArray(res[key])) return res[key];
  return [];
}

export default function Home({ setQueue, setCurrentIndex }) {
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [madeForYou, setMadeForYou] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [tRes, aRes, fRes, mRes] = await Promise.all([
          API.get("/songs/trending"),
          API.get("/albums"),
          API.get("/songs/featured"),
          API.get("/songs/made-for-you")
        ]);

        if (!mounted) return;

        setTrending(normalizeList(tRes.data, "songs").map(normalizeTrack));
        setAlbums(normalizeList(aRes.data, "albums"));
        setFeatured(normalizeList(fRes.data, "songs").map(normalizeTrack));
        setMadeForYou(normalizeList(mRes.data, "songs").map(normalizeTrack));
      } catch (e) {
        console.error("Home load failed", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  function playTracks(tracks, index = 0) {
    const playable = tracks.filter(t => t?.url);
    if (!playable.length) return;
    setQueue(playable);
    setCurrentIndex(index);
  }

  async function playAlbum(album) {
    try {
      const res = await API.get(`/albums/${album._id}`);
      const songs = (res.data?.songs || [])
        .map(s => ({
          id: s._id,
          title: s.title,
          artist: Array.isArray(s.artist)
            ? s.artist.join(", ")
            : s.artist || album.artist || "",
          cover: s.coverUrl || album.coverUrl || "",
          url: s.audioUrl || s.audio || s.stream || ""
        }))
        .filter(s => s.url);

      if (!songs.length) return;
      setQueue(songs);
      setCurrentIndex(0);
    } catch (e) {
      console.error("Album play failed", e);
    }
  }

  return (
    <div>

     
      <div className="sticky top-16  z-30 bg-[#f7f7f8] border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 ">
         <div className="flex gap-4 py-2">

            
            {["all", "featured", "albums"].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1  rounded-full text-sm ${
                  activeFilter === f
                    ? "bg-black text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {f === "all" ? "All" : f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

    
      <div className="space-y-14 pb-28 px-4 md:px-6 pt-4">

        {activeFilter === "all" && (
          <>
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Trending</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {loading ? <div className="text-gray-400">Loading...</div> :
                  trending.map((s, i) => (
                    <Card key={s.id} img={s.cover} title={s.title} subtitle={s.artist}
                      onPlay={() => playTracks(trending, i)} />
                  ))}
              </div>
            </section>

            {/* 2. MADE FOR YOU */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Made for you</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {madeForYou.map((s, i) => (
                  <Card key={s.id} img={s.cover} title={s.title} subtitle={s.artist}
                    onPlay={() => playTracks(madeForYou, i)} />
                ))}
              </div>
            </section>

            {/* 3. ALBUMS */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Albums</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {albums.map(a => (
                  <Card key={a._id} img={a.coverUrl} title={a.name}
                    subtitle={a.artist} onPlay={() => playAlbum(a)} />
                ))}
              </div>
            </section>

            {/* 4. FEATURED */}
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Featured</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {featured.map((s, i) => (
                  <Card key={s.id} img={s.cover} title={s.title} subtitle={s.artist}
                    onPlay={() => playTracks(featured, i)} />
                ))}
              </div>
            </section>
          </>
        )}

        {activeFilter === "featured" && (
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Featured</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {featured.map((s, i) => (
                <Card key={s.id} img={s.cover} title={s.title} subtitle={s.artist}
                  onPlay={() => playTracks(featured, i)} />
              ))}
            </div>
          </section>
        )}

        {activeFilter === "albums" && (
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Albums</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {albums.map(a => (
                <Card key={a._id} img={a.coverUrl} title={a.name}
                  subtitle={a.artist} onPlay={() => playAlbum(a)} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}