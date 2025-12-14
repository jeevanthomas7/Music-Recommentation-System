import { useEffect, useState } from "react";
import API from "../../api/api";

const GENRES = [
  "Pop",
  "Hip Hop",
  "Rock",
  "Jazz",
  "Classical",
  "Electronic",
  "Sad",
  "Romantic",
  "Lo-Fi",
  "Instrumental"
];

export default function SongForm({ editData = null, onSaved }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [genre, setGenre] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/albums").then(r => setAlbums(r.data));
  }, []);

  useEffect(() => {
    if (!editData) return;
    setTitle(editData.title || "");
    setArtist(editData.artist || "");
    setAlbumId(editData.album?._id || editData.album);
    setGenre(editData.genre || "");
  }, [editData]);

  function validate() {
    if (!title.trim()) return "Song title is required";
    if (!albumId) return "Album is required";
    if (!editData && !audioFile) return "Audio file is required";
    if (audioFile && audioFile.size > 25 * 1024 * 1024)
      return "Audio file must be under 25MB";
    return "";
  }

  async function submit(e) {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("artist", artist);
      form.append("albumId", albumId);
      form.append("genre", genre);
      if (imageFile) form.append("imageFile", imageFile);
      if (audioFile) form.append("audioFile", audioFile);

      if (editData) {
        await API.put(`/admin/song/${editData._id}`, form);
      } else {
        await API.post("/admin/songs", form);
      }

      reset();
      onSaved?.();
      alert(editData ? "Song updated successfully" : "Song added successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setTitle("");
    setArtist("");
    setAlbumId("");
    setGenre("");
    setImageFile(null);
    setAudioFile(null);
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-5xl w-full"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {editData ? "Edit Song" : "Add New Song"}
        </h2>
        <p className="text-sm text-gray-500">
          Audio and cover image will be uploaded to Cloudinary
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Song title *"
          className="border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
        />

        <input
          value={artist}
          onChange={e => setArtist(e.target.value)}
          placeholder="Artist"
          className="border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
        />

        <select
          value={albumId}
          onChange={e => setAlbumId(e.target.value)}
          className="border rounded-xl px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select album *</option>
          {albums.map(a => (
            <option key={a._id} value={a._id}>
              {a.title}
            </option>
          ))}
        </select>

        <select
          value={genre}
          onChange={e => setGenre(e.target.value)}
          className="border rounded-xl px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select genre</option>
          {GENRES.map(g => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="border rounded-xl px-4 py-3">
          <label className="block text-xs text-gray-500 mb-1">
            Audio File {editData ? "" : "*"}
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={e => setAudioFile(e.target.files[0])}
            className="text-sm w-full"
          />
          {audioFile && (
            <div className="text-xs text-gray-600 mt-1 truncate">
              {audioFile.name}
            </div>
          )}
        </div>

        <div className="border rounded-xl px-4 py-3">
          <label className="block text-xs text-gray-500 mb-1">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
            className="text-sm w-full"
          />
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              className="w-24 h-24 mt-2 rounded-lg object-cover"
              alt="preview"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Uploading..." : editData ? "Update Song" : "Add Song"}
        </button>
      </div>
    </form>
  );
}
