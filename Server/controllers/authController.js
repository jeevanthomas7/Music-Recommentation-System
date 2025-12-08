import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export const googleAuth = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "missing token" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // ---------- ADMIN EMAIL CHECK ----------
    const email = (payload.email || "").trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const isAdmin = email && adminEmail && email === adminEmail;

    console.log("PAYLOAD EMAIL:", email);
    console.log("ADMIN EMAIL:", adminEmail);
    console.log("MATCH RESULT (isAdmin):", isAdmin);

    // use email as key, and always update role based on isAdmin
    const user = await User.findOneAndUpdate(
      { email }, // find by email
      {
        name: payload.name,
        email,
        googleId: payload.sub,
        avatar: payload.picture,
        role: isAdmin ? "admin" : "user",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const token = createToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "auth failed" });
  }
};
