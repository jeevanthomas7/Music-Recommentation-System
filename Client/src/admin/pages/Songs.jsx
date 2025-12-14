import { useEffect, useState } from "react";
import API from "../../api/api";

export default function Songs() {
  const [songs, setSongs] = useState([]);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [audio, setAudio] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    API.get("/songs").then(r => setSongs(r.data));
  }, []);

  async function upload(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    fd.append("artist", artist);
    fd.append("albumId", albumId);
    fd.append("audioFile", audio);
    if (image) fd.append("imageFile", image);

    await API.post("/admin/songs", fd);
    const res = await API.get("/songs");
    setSongs(res.data);
  }

  async function remove(id) {
    await API.delete(`/admin/songs/${id}`);
    setSongs(s => s.filter(x => x._id !== id));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={upload} className="bg-white p-4 rounded-xl border space-y-3">
        <input className="border px-3 py-2 w-full" placeholder="Title" onChange={e => setTitle(e.target.value)} />
        <input className="border px-3 py-2 w-full" placeholder="Artist" onChange={e => setArtist(e.target.value)} />
        <input className="border px-3 py-2 w-full" placeholder="Album ID" onChange={e => setAlbumId(e.target.value)} />
        <input type="file" onChange={e => setAudio(e.target.files[0])} />
        <input type="file" onChange={e => setImage(e.target.files[0])} />
        <button className="bg-black text-white px-4 py-2 rounded">Upload</button>
      </form>

      <div className="bg-white rounded-xl border">
        {songs.map(s => (
          <div key={s._id} className="flex justify-between px-4 py-2 border-b">
            <div>{s.title}</div>
            <button onClick={() => remove(s._id)} className="text-red-600">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
