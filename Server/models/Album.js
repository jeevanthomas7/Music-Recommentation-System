import mongoose from "mongoose"

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    year: { type: Number },
    genre: { type: String },
    coverUrl: { type: String },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
      }
    ]
  },
  { timestamps: true }
)

export const Album = mongoose.model("Album", albumSchema)
