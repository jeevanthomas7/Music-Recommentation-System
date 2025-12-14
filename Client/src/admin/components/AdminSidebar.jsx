import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiStar,
  FiMusic,
  FiDisc
} from "react-icons/fi";

const links = [
  { to: "/admin", label: "Dashboard", icon: FiGrid },
  { to: "/admin/users", label: "Users", icon: FiUsers },
 { to: "/admin/songs", label: "Songs", icon: FiMusic },
  { to: "/admin/albums", label: "Albums", icon: FiDisc }
];

export default function AdminSidebar() {
  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-gray-200">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        
      
        <span className="ml-3 text-sm font-semibold text-gray-900">
          Dot-In Admin
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition
              ${
                isActive
                  ? "bg-emerald-100 text-emerald-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            <Icon className="text-lg" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} Dot-In
      </div>
    </aside>
  );
}
