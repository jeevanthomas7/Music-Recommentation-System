import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="p-5 font-bold text-lg">Admin Panel</div>
      <nav className="px-3 space-y-2">
        <NavLink to="/admin" end className="block px-4 py-2 rounded hover:bg-gray-100">
          Dashboard
        </NavLink>
        <NavLink to="/admin/songs" className="block px-4 py-2 rounded hover:bg-gray-100">
          Songs
        </NavLink>
        <NavLink to="/admin/albums" className="block px-4 py-2 rounded hover:bg-gray-100">
          Albums
        </NavLink>
      </nav>
    </aside>
  );
}
