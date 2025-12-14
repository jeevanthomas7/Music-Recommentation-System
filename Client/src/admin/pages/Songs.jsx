import { useEffect, useState } from "react";
import API from "../../api/api";
import SongForm from "../components/SongForm";

export default function Songs() {
  const [songs, setSongs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [success, setSuccess] = useState("");

  function load() {
    API.get("/songs").then(r => setSongs(r.data));
  }

  useEffect(load, []);

  async function removeSong() {
    await API.delete(`/admin/songs/${confirmId}`);
    setConfirmId(null);
    setSuccess("Song deleted successfully");
    load();
    setTimeout(() => setSuccess(""), 3000);
  }

  return (
    <div className="space-y-8">

      <SongForm
        editData={editing}
        onSaved={() => {
          setEditing(null);
          load();
          setSuccess("Song updated successfully");
          setTimeout(() => setSuccess(""), 3000);
        }}
      />

      {success && (
        <div className="rounded-xl bg-emerald-50 text-emerald-700 px-4 py-3 font-medium">
          {success}
        </div>
      )}

      <div className="bg-white rounded-2xl border overflow-hidden">
        {songs.map(s => (
          <div
            key={s._id}
            className="flex items-center justify-between gap-4 p-4 border-b hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <img
                src={s.coverUrl}
                className="w-14 h-14 rounded-lg object-cover bg-gray-100"
              />

              <div>
                <div className="font-semibold text-gray-900">
                  {s.title}
                </div>
                <div className="text-sm text-gray-500">
                  {s.artist}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditing(s)}
                className="text-sm px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              >
                Edit
              </button>

              <button
                onClick={() => setConfirmId(s._id)}
                className="text-sm px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete song?
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete this song? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 rounded-lg border text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={removeSong}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
