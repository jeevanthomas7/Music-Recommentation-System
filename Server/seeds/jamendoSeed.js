import mongoose from "mongoose"
import axios from "axios"
import dotenv from "dotenv"
import Album from "../models/Album.js";
import Song from "../models/Song.js";

const JAMENDO_BASE_URL = "https://api.jamendo.com/v3.0";

export const importFromJamendo = async (req, res) => {
  try {
    const clientId = process.env.JAMENDO_CLIENT_ID;

    const { data } = await axios.get(
      `${JAMENDO_BASE_URL}/albums/tracks`,
      {
        params: {
          client_id: clientId,
          format: "json",
          limit: 10,
          audioformat: "mp32",
          imagesize: 300,
          include: "musicinfo",     // ⇦ important for genre
          order: "popularity_total_desc"
        }
      }
    );

    const albumsFromApi = data.results || [];

    await Album.deleteMany();
    await Song.deleteMany();

    const albumsToInsert = albumsFromApi.map(a => ({
      title: a.name,
      artist: a.artist_name,
      year: a.releasedate ? Number(a.releasedate.slice(0, 4)) : undefined,
      genre: a.musicinfo?.tags?.genres?.length ? a.musicinfo.tags.genres[0].name : "",
      coverUrl: a.image
    }));

    const insertedAlbums = await Album.insertMany(albumsToInsert);

    const albumIdMap = {};
    albumsFromApi.forEach((a, index) => {
      albumIdMap[a.id] = insertedAlbums[index]._id;
    });

    const songsToInsert = [];

    albumsFromApi.forEach(a => {
      const albumMongoId = albumIdMap[a.id];

      if (Array.isArray(a.tracks)) {
        a.tracks.forEach(t => {
          songsToInsert.push({
            title: t.name,
            artist: a.artist_name,
            album: albumMongoId,
            genre: t.musicinfo?.tags?.genres?.length ? t.musicinfo.tags.genres[0].name : "",
            duration: Number(t.duration),
            audioUrl: t.audio,
            coverUrl: a.image
          });
        });
      }
    });

    const insertedSongs = await Song.insertMany(songsToInsert);

    const albumSongMap = {};
    insertedSongs.forEach(song => {
      const key = song.album.toString();
      if (!albumSongMap[key]) albumSongMap[key] = [];
      albumSongMap[key].push(song._id);
    });

    await Promise.all(
      Object.entries(albumSongMap).map(([id, songs]) =>
        Album.findByIdAndUpdate(id, { $set: { songs } })
      )
    );

    res.status(200).json({
      message: "imported from jamendo with genre",
      albums: insertedAlbums.length,
      songs: insertedSongs.length
    });
  } catch (error) {
    res.status(500).json({ message: "jamendo import failed" });
  }
};
