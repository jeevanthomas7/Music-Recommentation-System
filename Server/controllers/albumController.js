import { Album } from "../models/Album.js"

export const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find().sort({ createdAt: -1 })
    res.json(albums)
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch albums" })
  }
}

export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate("songs")
    if (!album) {
      return res.status(404).json({ message: "Album not found" })
    }
    res.json(album)
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch album" })
  }
}
