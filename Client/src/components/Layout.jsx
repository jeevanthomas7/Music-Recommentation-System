import React, { useEffect, useState, useCallback } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import PlayerBar from "./Playerbar";
import Footer from "./Footer";
import API from "../api/api.js";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadUser = useCallback(async () => {
    try {
      const res = await API.get("/auth/me");
      const u = res?.data?.user || res?.data;
      if (!u) return;

      const userObj = {
        name: u.name,
        email: u.email,
        avatar: u.avatar || u.picture || "",
        isPremium: Boolean(u.isPremium || u.premiumPlan),
        id: u._id || u.id
      };

      setUser(userObj);
      localStorage.setItem("dotin_user", JSON.stringify(userObj));
    } catch {
      const raw = localStorage.getItem("dotin_user");
      setUser(raw ? JSON.parse(raw) : null);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  function handlePlay(queue, index = 0) {
    setPlaylist(queue);
    setCurrentIndex(index);
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-gray-900">
      <Header initialUser={user} />
      <Sidebar user={user} onPlay={handlePlay} />


      <main className="pt-16 pb-20 ml-0 md:ml-80">
        <div className="max-w-[1600px] mx-auto px-6">
          {React.cloneElement(children, {
            setQueue: setPlaylist,
            setCurrentIndex
          })}
        </div>

        
        <Footer />
      </main>

      <PlayerBar
        playlist={playlist}
        initialIndex={currentIndex}
      />
    </div>
  );
}
