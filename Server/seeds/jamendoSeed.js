import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import {Album} from "../models/Album.js";
import {Song} from "../models/Song.js";

dotenv.config();

const MONGODB_URI = "mongodb://127.0.0.1:27017/spotifyclone";
const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID;

async function connectDB() {
  await mongoose.connect(MONGODB_URI);
}

async function fetchJamendoAlbums(limit = 10) {
  const url = "https://api.jamendo.com/v3.0/albums/tracks";
  const res = await axios.get(url, {
    params: {
      client_id: JAMENDO_CLIENT_ID,
      format: "json",
      limit,
      include: "musicinfo",
      imagesize: 600,
      audioformat: "mp31",
      audiodlformat: "mp31",
      streaming: true,
      order: "popularity_total_desc"
    }
  });
  return res.data.results;
}

async function seedJamendo() {
  try {
    await connectDB();

    await Song.deleteMany();
    await Album.deleteMany();

    const albums = await fetchJamendoAlbums(200);
    let totalSongs = 0;

    for (const a of albums) {
      const albumGenre = a.musicinfo?.tags?.genres?.[0]?.name || "Unknown";

      const albumDoc = await Album.create({
        title: a.name,
        artist: a.artist_name,
        year: a.releasedate ? new Date(a.releasedate).getFullYear() : undefined,
        genre: albumGenre,
        coverUrl: a.image
      });

      for (const t of a.tracks || []) {
        const songGenre = t.musicinfo?.tags?.genres?.[0]?.name || albumGenre;
        const audioUrl = t.audio || t.audiodl || "";

        const songDoc = await Song.create({
          title: t.name,
          artist: a.artist_name,
          album: albumDoc._id,
          genre: songGenre,
          coverUrl: a.image,
          duration: Number(t.duration),
          audioUrl
        });

        albumDoc.songs.push(songDoc._id);
        totalSongs++;
      }

      await albumDoc.save();
    }

    console.log("Imported Albums:", albums.length);
    console.log("Imported Songs:", totalSongs);

    await mongoose.disconnect();
  } catch (e) {
    console.log("Error:", e.message);
    await mongoose.disconnect();
  }
}

seedJamendo();
