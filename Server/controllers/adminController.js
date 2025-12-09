import { Song } from "../models/Song.js"
import { Album } from "../models/Album.js"
import User from "../models/User.js"
import cloudinary from "../config/cloudinary.js"

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    })
    return result.secure_url
  } catch (error) {
    console.log("Error in uploadToCloudinary", error)
    throw new Error("Error uploading to cloudinary")
  }
}

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile) {
      return res.status(400).json({ message: "Audio file is required" })
    }

    const { title, artist, albumId, genre, duration } = req.body
    const audioFile = req.files.audioFile
    const imageFile = req.files?.imageFile || null

    if (!title) {
      return res.status(400).json({ message: "Title is required" })
    }

    if (!albumId) {
      return res.status(400).json({ message: "Album is required" })
    }

    const audioUrl = await uploadToCloudinary(audioFile)
    let coverUrl

    if (imageFile) {
      coverUrl = await uploadToCloudinary(imageFile)
    }

    const song = new Song({
      title,
      artist,
      album: albumId,
      genre: genre || "Unknown",
      coverUrl,
      duration,
      audioUrl,
    })

    await song.save()

    await Album.findByIdAndUpdate(albumId, {
      $push: { songs: song._id },
    })

    res.status(201).json(song)
  } catch (error) {
    console.log("Error in createSong", error)
    next(error)
  }
}
// export const createSong = async (req, res, next) => {
//   try {
//     const { title, artist, albumId, genre, duration, audioUrl, coverUrl } = req.body

//     if (!title) return res.status(400).json({ message: "Title is required" })
//     if (!albumId) return res.status(400).json({ message: "Album is required" })

//     let finalAudioUrl = audioUrl
//     let finalCoverUrl = coverUrl

//     if (req.files?.audioFile) {
//       finalAudioUrl = await uploadToCloudinary(req.files.audioFile)
//     }
//     if (req.files?.imageFile) {
//       finalCoverUrl = await uploadToCloudinary(req.files.imageFile)
//     }

//     if (!finalAudioUrl) {
//       return res.status(400).json({ message: "Audio url or file required" })
//     }

//     const song = new Song({
//       title,
//       artist,
//       album: albumId,
//       genre: genre || "Unknown",
//       coverUrl: finalCoverUrl,
//       duration,
//       audioUrl: finalAudioUrl,
//     })

//     await song.save()
//     await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } })

//     res.status(201).json(song)
//   } catch (error) {
//     next(error)
//   }
// }


export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params

    const song = await Song.findById(id)
    if (!song) {
      return res.status(404).json({ message: "Song not found" })
    }

    if (song.album) {
      await Album.findByIdAndUpdate(song.album, {
        $pull: { songs: song._id },
      })
    }

    await Song.findByIdAndDelete(id)

    res.status(200).json({ message: "Song deleted successfully" })
  } catch (error) {
    console.log("Error in deleteSong", error)
    next(error)
  }
}
export const updateSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, artist, albumId, genre, duration } = req.body;

    const song = await Song.findById(id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    let audioUrl = song.audioUrl;
    let coverUrl = song.coverUrl;

    if (req.files?.audioFile) {
      audioUrl = await uploadToCloudinary(req.files.audioFile);
    }

    if (req.files?.imageFile) {
      coverUrl = await uploadToCloudinary(req.files.imageFile);
    }

    if (albumId && albumId !== song.album?.toString()) {
      if (song.album) {
        await Album.findByIdAndUpdate(song.album, { $pull: { songs: song._id } });
      }
      await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } });
    }

    song.title = title ?? song.title;
    song.artist = artist ?? song.artist;
    song.album = albumId ?? song.album;
    song.genre = genre ?? song.genre;
    song.duration = duration ?? song.duration;
    song.audioUrl = audioUrl;
    song.coverUrl = coverUrl;

    await song.save();

    res.status(200).json(song);
  } catch (error) {
    next(error);
  }
};


export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, year, genre } = req.body
    const imageFile = req.files?.imageFile || null

    if (!title || !artist) {
      return res.status(400).json({ message: "Title and artist are required" })
    }

    let coverUrl
    if (imageFile) {
      coverUrl = await uploadToCloudinary(imageFile)
    }

    const album = new Album({
      title,
      artist,
      year,
      genre,
      coverUrl,
    })

    await album.save()

    res.status(201).json(album)
  } catch (error) {
    console.log("Error in createAlbum", error)
    next(error)
  }
}

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params

    await Song.deleteMany({ album: id })
    await Album.findByIdAndDelete(id)

    res.status(200).json({ message: "Album deleted successfully" })
  } catch (error) {
    console.log("Error in deleteAlbum", error)
    next(error)
  }
}

export const updateAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, artist, year, genre } = req.body;

    const album = await Album.findById(id);
    if (!album) return res.status(404).json({ message: "Album not found" });

    let coverUrl = album.coverUrl;

    if (req.files?.imageFile) {
      coverUrl = await uploadToCloudinary(req.files.imageFile);
    }

    album.title = title ?? album.title;
    album.artist = artist ?? album.artist;
    album.year = year ?? album.year;
    album.genre = genre ?? album.genre;
    album.coverUrl = coverUrl;

    await album.save();

    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};


export const checkAdmin = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === "admin"
    res.status(200).json({ admin: isAdmin, user: req.user })
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "name email role createdAt")
    res.status(200).json(users)
  } catch (error) {
    console.log("Error in getUsers", error)
    next(error)
  }
}
