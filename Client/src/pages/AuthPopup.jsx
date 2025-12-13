import React from "react";

export default function AuthPopup({ open, onClose }) {
  if (!open) return null;

  return (
    <div id="auth-popup-ignore" className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-[#0f0f0f] w-[90%] max-w-lg rounded-2xl p-8 shadow-xl border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-4">Start listening with a free account</h2>
        <p className="text-gray-400 mb-6">Log in or sign up to continue using Dot-In.</p>

        <button
          onClick={() => (window.location.href = "/signup")}
          className="w-full py-3 rounded-full bg-emerald-500 text-black font-semibold text-lg hover:bg-emerald-400"
        >
          Sign up free
        </button>

        <button
          onClick={() => (window.location.href = "/login")}
          className="w-full mt-3 py-3 rounded-full bg-white/10 text-white font-semibold text-lg hover:bg-white/20"
        >
          Log in
        </button>

        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-400 text-sm hover:text-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}
