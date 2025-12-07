import mongoose from "mongoose"

const songSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String },
    album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
    image: { type: String },
    audioUrl: { type: String },
    duration: { type: Number },
    artist: { type: String },
    jamendoId: { type: Number },
    license: { type: String }
  },
  { timestamps: true }
)

export const Song = mongoose.model("Song", songSchema)
