import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { postGoogleCredential } from "../api/authService";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dotin_user");
      if (!raw) return;
      const user = JSON.parse(raw);
      if (user?.role === "admin") navigate("/admin");
      else navigate("/");
    } catch {}
  }, [navigate]);

  async function handleGoogle(response) {
    setLoading(true);
    setErr("");
    try {
      const credential = response?.credential;
      if (!credential) throw new Error("Google credential missing");
      const data = await postGoogleCredential(credential);
      if (!data) throw new Error("Invalid server response");
      if (data.token) localStorage.setItem("dotin_token", data.token);
      if (data.user) {
        localStorage.setItem("dotin_user", JSON.stringify(data.user));
        localStorage.setItem("dotin_role", data.user.role || "user");
        if (data.user.role === "admin") {
          navigate("/admin");
          return;
        }
      }
      navigate("/");
      window.location.reload();
    } catch (e) {
      setErr(e.response?.data?.message || e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4">
      <div className="w-full max-w-3xl text-center mt-16 mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Create An Account</h1>
        <p className="text-gray-600 mt-2">Join Dot-In to save playlists and enjoy premium features</p>
      </div>

      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-sm p-10">
        <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-purple-600 to-pink-400 flex items-center justify-center text-white text-3xl font-bold mb-6">
          !
        </div>

        <div className="text-center mb-8">
          <div className="text-2xl font-semibold text-gray-900">D o t - I n</div>
          <div className="text-sm text-gray-500 mt-1">Quickly create an account with Google</div>
        </div>

        <div className="flex justify-center mb-6">
          <GoogleLogin onSuccess={handleGoogle} onError={() => setErr("Google sign-in failed")} />
        </div>

        {loading && (
          <div className="text-center text-gray-600 text-sm mb-2">Creating account…</div>
        )}

        {err && (
          <div className="text-center text-red-500 text-sm mb-4">{err}</div>
        )}

        <div className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <button
            className="text-blue-600 font-medium hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}