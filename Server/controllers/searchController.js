export const searchAll = async (req, res) => {
  const q = req.query.q || "";
  if (!q.trim()) return res.json({ songs: [], albums: [] });

  const regex = new RegExp(q, "i");

  const songs = await Song.find({
    $or: [{ title: regex }, { artist: regex }]
  }).limit(5);

  const albums = await Album.find({
    $or: [{ title: regex }, { artist: regex }]
  }).limit(5);

  res.json({ songs, albums });
};
