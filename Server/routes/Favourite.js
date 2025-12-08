import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    songId: { type: mongoose.Schema.Types.ObjectId, ref: "Song" }
  },
  { timestamps: true }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
