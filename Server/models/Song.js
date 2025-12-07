import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String },
    album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true },
    genre: { type: String, default: "Unknown" },
    coverUrl: { type: String },
    duration: { type: Number },
    audioUrl: { type: String, required: true }
  },
  { timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);
