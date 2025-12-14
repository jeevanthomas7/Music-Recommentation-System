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

export default function AlbumForm({ editData = null, onSaved }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editData) return;
    setTitle(editData.title || "");
    setArtist(editData.artist || "");
    setYear(editData.year || "");
    setGenre(editData.genre || "");
    setImageFile(null);
  }, [editData]);

  function validate() {
    if (!title.trim()) return "Album title is required";
    if (!artist.trim()) return "Artist is required";
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
      form.append("year", year);
      form.append("genre", genre);
      if (imageFile) form.append("imageFile", imageFile);

      if (editData) {
        await API.put(`/admin/album/${editData._id}`, form);
      } else {
        await API.post("/admin/albums", form);
      }

      reset();
      onSaved?.();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setTitle("");
    setArtist("");
    setYear("");
    setGenre("");
    setImageFile(null);
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-5xl w-full"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {editData ? "Edit Album" : "Add New Album"}
        </h2>
        <p className="text-sm text-gray-500">
          Album cover will be uploaded to Cloudinary
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
          placeholder="Album title *"
          className="border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
        />

        <input
          value={artist}
          onChange={e => setArtist(e.target.value)}
          placeholder="Artist *"
          className="border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="number"
          value={year}
          onChange={e => setYear(e.target.value)}
          placeholder="Release year"
          className="border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={genre}
          onChange={e => setGenre(e.target.value)}
          className="border rounded-xl px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select genre</option>
          {GENRES.map(g => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
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
            className="w-28 h-28 mt-3 rounded-xl object-cover"
          />
        )}

        {!imageFile && editData?.coverUrl && (
          <img
            src={editData.coverUrl}
            className="w-28 h-28 mt-3 rounded-xl object-cover"
          />
        )}
      </div>

      <div className="flex justify-end">
        <button
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : editData ? "Update Album" : "Add Album"}
        </button>
      </div>
    </form>
  );
}
