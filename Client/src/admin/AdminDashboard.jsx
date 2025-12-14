import { Routes, Route } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import Dashboard from "./pages/Dashboard";
import Songs from "./pages/Songs";
import Albums from "./pages/Albums";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#f7f7f8] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="p-6">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="Addsong" element={<Songs />} />
            <Route path="albums" element={<Albums />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
