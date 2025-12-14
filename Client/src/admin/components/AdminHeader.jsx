import { FiLogOut, FiShield } from "react-icons/fi";
import { postLogout } from "../../api/authService";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();

  async function logout() {
    await postLogout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="h-16 max-w-[1600px] mx-auto px-4 md:px-6 flex items-center justify-between">

     
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
            !
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-900">
              Dot-In
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <FiShield className="text-emerald-500" />
              Admin Panel
            </span>
          </div>
        </div>

       
        <div className="flex items-center gap-4">
       
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            ADMIN
          </span>

       
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-full
                       bg-gray-900 text-white text-sm font-medium
                       hover:bg-black transition"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
