import { useEffect, useState } from "react";
import API from "../../api/api";

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    API.get("/albums").then(r => setAlbums(r.data));
  }, []);

  async function upload(e) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    fd.append("artist", artist);
    if (image) fd.append("imageFile", image);

    await API.post("/admin/albums", fd);
    const res = await API.get("/albums");
    setAlbums(res.data);
  }

  async function remove(id) {
    await API.delete(`/admin/albums/${id}`);
    setAlbums(a => a.filter(x => x._id !== id));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={upload} className="bg-white p-4 rounded-xl border space-y-3">
        <input className="border px-3 py-2 w-full" placeholder="Album Title" onChange={e => setTitle(e.target.value)} />
        <input className="border px-3 py-2 w-full" placeholder="Artist" onChange={e => setArtist(e.target.value)} />
        <input type="file" onChange={e => setImage(e.target.files[0])} />
        <button className="bg-black text-white px-4 py-2 rounded">Create Album</button>
      </form>

      <div className="bg-white rounded-xl border">
        {albums.map(a => (
          <div key={a._id} className="flex justify-between px-4 py-2 border-b">
            <div>{a.title}</div>
            <button onClick={() => remove(a._id)} className="text-red-600">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
