import React, { useEffect, useRef, useState } from "react";
import {
  FiHome,
  FiCamera,
  FiMenu,
  FiX,
  FiChevronDown,
  FiSearch
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { fetchMe, postLogout } from "../api/authService";

function initialsAvatar(name = "User") {
  const initials = name
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return `https://ui-avatars.com/api/?name=${initials}&background=7C3AED&color=fff`;
}

export default function Header({ initialUser = null }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(initialUser);
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem("dotin_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  useEffect(() => {
    async function sync() {
      try {
        const res = await fetchMe();
        if (res?.user) {
          setUser(res.user);
          localStorage.setItem("dotin_user", JSON.stringify(res.user));
        }
      } catch {}
    }
    sync();
  }, []);

  useEffect(() => {
    const close = e => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const go = path => {
    navigate(path);
    setMobileOpen(false);
  };

  const doSearch = () => {
    const s = q.trim();
    if (!s) return;
    navigate(`/search?q=${encodeURIComponent(s)}`);
    setMobileOpen(false);
  };

  const logout = async () => {
    await postLogout().catch(() => {});
    localStorage.removeItem("dotin_user");
    localStorage.removeItem("dotin_token");
    setUser(null);
    go("/login");
  };

  return (
    <>
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="h-16 flex items-center gap-4">

            {/* LOGO */}
            <button
              onClick={() => go("/")}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-400 flex items-center justify-center text-white font-bold">
                !
              </div>
              <span className="hidden sm:inline font-semibold text-gray-900">
                Dot-In
              </span>
            </button>

            {/* SEARCH (DESKTOP + MOBILE) */}
            <div className="flex-1 flex justify-center px-2">
              <div className="w-full max-w-[760px]">
                <div className="flex items-center border border-gray-200 rounded-full px-3 py-2 shadow-sm">
                  <FiSearch className="text-gray-400 mr-2" />
                  <input
                    className="flex-1 text-sm outline-none"
                    placeholder="Search songs, artists, albums"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && doSearch()}
                  />
                  <button
                    onClick={doSearch}
                    className="ml-3 px-3 py-1 rounded-full text-sm bg-gray-900 text-white hidden sm:inline"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* DESKTOP ACTIONS */}
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => go("/")} className="p-2 rounded-full hover:bg-gray-100">
                <FiHome />
              </button>

              <button onClick={() => go("/camera")} className="p-2 rounded-full hover:bg-gray-100">
                <FiCamera />
              </button>

              {!user?.isPremium && (
                <button
                  onClick={() => go("/premium")}
                  className="px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold"
                >
                  Go Premium
                </button>
              )}

              {!user ? (
                <>
                  <button onClick={() => go("/signup")} className="text-sm">
                    Sign up
                  </button>
                  <button
                    onClick={() => go("/login")}
                    className="bg-gray-900 text-white px-4 py-2 rounded-full"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(v => !v)}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={user.avatar || initialsAvatar(user.name)}
                      className="w-9 h-9 rounded-full"
                      alt=""
                    />
                    <FiChevronDown />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg">
                      <button onClick={() => go("/profile")} className="block w-full px-4 py-2 text-left hover:bg-gray-50">
                        Profile
                      </button>
                      <button onClick={logout} className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100"
              onClick={() => setMobileOpen(true)}
            >
              <FiMenu />
            </button>

          </div>
        </div>
      </header>

      {/* HEADER SPACER */}
      <div className="h-16" />

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <aside className="w-72 bg-white h-full p-4 border-r">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setMobileOpen(false)}>
                <FiX />
              </button>
            </div>

            <button onClick={() => go("/")} className="block w-full py-2">
              Home
            </button>
            <button onClick={() => go("/camera")} className="block w-full py-2">
              Camera
            </button>
            <button onClick={() => go("/premium")} className="block w-full py-2">
              Premium
            </button>

            {!user ? (
              <>
                <button onClick={() => go("/signup")} className="block w-full py-2">
                  Sign up
                </button>
                <button onClick={() => go("/login")} className="block w-full py-2">
                  Log in
                </button>
              </>
            ) : (
              <>
                <button onClick={() => go("/profile")} className="block w-full py-2">
                  Profile
                </button>
                <button onClick={logout} className="block w-full py-2 text-red-600">
                  Logout
                </button>
              </>
            )}
          </aside>

          <div
            className="flex-1 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </>
  );
}
