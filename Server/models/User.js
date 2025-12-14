import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String, required: true },
    avatar: { type: String },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    isPremium: {
      type: Boolean,
      default: false
    },

    premiumPlan: {
      type: String,
      enum: ["monthly", "yearly", null],
      default: null
    },

    premiumExpiresAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
