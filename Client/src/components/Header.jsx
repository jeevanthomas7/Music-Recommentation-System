import React, { useEffect, useRef, useState } from "react";
import { FiHome, FiCamera, FiMenu, FiX, FiChevronDown, FiSearch } from "react-icons/fi";
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
  const [premiumOpen, setPremiumOpen] = useState(false);
  const profileRef = useRef(null);
  const premiumRef = useRef(null);

useEffect(() => {
  const raw = localStorage.getItem("dotin_user");
  if (raw) setUser(JSON.parse(raw));
}, []);



useEffect(() => {
  const onPremiumUpdate = (e) => {
    console.log("HEADER PREMIUM UPDATE:", e.detail);
    setUser(e.detail);
    localStorage.setItem("dotin_user", JSON.stringify(e.detail));
  };

  window.addEventListener("dotin_user_updated", onPremiumUpdate);
  return () =>
    window.removeEventListener("dotin_user_updated", onPremiumUpdate);
}, []);



  useEffect(() => {
    const close = (e) => {
      if (premiumRef.current && !premiumRef.current.contains(e.target)) {
        setPremiumOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const go = (p) => navigate(p);

  const doSearch = () => {
    const s = (q || "").trim();
    if (!s) return;
    navigate(`/search?q=${encodeURIComponent(s)}`);
  };
  const logout = async () => {
    await postLogout().catch(() => {});
    try { localStorage.removeItem("dotin_user"); } catch (e) {}
    try { localStorage.removeItem("dotin_token"); } catch (e) {}
    setUser(null);
    setProfileOpen(false);
    go("/login");
  };

  function avatarOnError(e) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = initialsAvatar(user?.name);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="h-16 flex items-center gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={() => go("/")} className="p-2 rounded-md hover:bg-gray-50 transition flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-400 flex items-center justify-center text-white font-bold">!</div>
                <span className="hidden sm:inline text-sm font-semibold text-gray-900">D o t - I n</span>
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center gap-4 px-4">
              <div className="hidden md:flex items-center">
                <button onClick={() => go("/")} title="Home" className="p-2 rounded-full hover:bg-gray-100">
                  <FiHome className="text-gray-700" />
                </button>
              </div>

              <div className="w-full max-w-[760px]">
                <div className="flex items-center border border-gray-200 rounded-full px-3 py-2 bg-white shadow-sm">
                  <FiSearch className="text-gray-400 mr-3" />
                  <input
                    id="hdr-search"
                    className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
                    placeholder="Search songs, artists, albums"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && doSearch()}
                  />
                  <button onClick={doSearch} className="ml-3 px-3 py-1 rounded-full text-sm font-medium text-white bg-gray-900 hover:bg-black hidden sm:inline">Search</button>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <button onClick={() => go("/camera")} className="p-2 rounded-full hover:bg-gray-100" title="Camera">
                  <FiCamera className="text-gray-700" />
                </button>

<div ref={premiumRef} className="relative">
  {!user?.isPremium ? (
    <button
      onClick={() => go("/premium")}
      className="hidden lg:inline-flex items-center gap-2 px-5 py-2 rounded-full 
                 bg-gradient-to-r from-emerald-400 to-emerald-600
                 text-black font-semibold shadow-md hover:scale-[1.03] transition"
    >
      Go Premium
    </button>
  ) : (
    <button
      onClick={() => setPremiumOpen(v => !v)}
      className="hidden lg:inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                 bg-emerald-600 text-white font-semibold shadow-md"
    >
      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
      PRO
      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
        ACTIVE
      </span>
    </button>
  )}

 {premiumOpen && user?.isPremium && (
  <div className="absolute right-0 mt-3 w-80 bg-white
                  border border-emerald-100 rounded-2xl shadow-xl
                  p-5 text-sm z-50">

    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-xs text-gray-500">Current Plan</div>
        <div className="text-lg font-bold text-gray-900">
          {user?.premiumPlan?.toUpperCase() || "PREMIUM"}
        </div>
      </div>

      <span className="px-3 py-1 rounded-full text-xs font-semibold
                       bg-emerald-100 text-emerald-700">
        ACTIVE
      </span>
    </div>

    <div className="mb-4">
      <div className="text-xs text-gray-500">Valid till</div>
<div className="font-medium text-gray-500">
  {user?.premiumExpiresAt
    ? new Date(user.premiumExpiresAt).toDateString()
    : "—"}
</div>


    </div>
  </div>
)}
</div>

</div>
</div>

            <div className="flex items-center gap-3">
              {!user ? (
                <>
                  <button onClick={() => go("/signup")} className="hidden md:inline text-sm text-gray-700 hover:text-gray-900">Sign up</button>
                  <button onClick={() => go("/login")} className="hidden md:inline bg-gray-900 text-white px-4 py-2 rounded-full font-semibold hover:bg-black">Log in</button>
                  <button className="md:hidden p-2 rounded-md hover:bg-gray-50" onClick={() => setMobileOpen(true)}><FiMenu /></button>
                </>
              ) : (
                <div ref={profileRef} className="relative">
                  <button onClick={() => setProfileOpen(v => !v)} className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100">
                    <img
                      src={user.avatar || initialsAvatar(user.name)}
                      onError={avatarOnError}
                      alt="me"
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                    <span className="hidden md:inline text-sm font-medium text-gray-900">{user.name?.split(" ")[0]}</span>
                    <FiChevronDown className="text-gray-700" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      <div className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || initialsAvatar(user.name)}
                            onError={avatarOnError}
                            alt="me"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 truncate">{user.name}</div>
                            <div className="text-xs text-gray-500 truncate break-all">{user.email}</div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100" />

                      <div className="p-2">
                        <button onClick={() => { go("/profile"); setProfileOpen(false); }} className="w-full text-left px-3 py-2 rounded text-black hover:bg-gray-50 text-sm">Profile</button>
                        <button onClick={() => { go("/settings"); setProfileOpen(false); }} className="w-full text-left px-3 py-2 rounded text-black hover:bg-gray-50 text-sm">Settings</button>
                      </div>

                      <div className="border-t border-gray-100" />

                      <div className="p-3">
                        <button onClick={logout} className="w-full text-left px-3 py-2 rounded text-red-600 font-medium hover:bg-red-50">Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="h-16" />

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <aside className="w-72 bg-white h-full p-4 border-r border-gray-200 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-400 flex items-center justify-center text-white font-bold">!</div>
                <div className="font-semibold text-gray-900">Dot-In</div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded hover:bg-gray-100"><FiX /></button>
            </div>

            <button onClick={() => { go("/"); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Home</button>
            <button onClick={() => { go("/favourites"); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Favourites</button>
            <button onClick={() => { go("/premium"); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Premium</button>

            <div className="mt-4">
              {!user ? (
                <button onClick={() => { go("/login"); setMobileOpen(false); }} className="w-full bg-gray-900 text-white py-2 rounded-full">Log in</button>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <img src={user.avatar || initialsAvatar(user.name)} onError={(e) => (e.currentTarget.src = initialsAvatar(user.name))} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <button onClick={() => { go("/profile"); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Profile</button>
                  <button onClick={() => { go("/settings"); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50">Settings</button>
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left px-3 py-2 rounded text-red-600 font-medium">Logout</button>
                  </div>
                </>
              )}
            </div>
          </aside>

          <div className="flex-1 bg-black/20" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
