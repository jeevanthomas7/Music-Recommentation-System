import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Songs from "./pages/Songs";
import Albums from "./pages/Albums";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="songs" element={<Songs />} />
        <Route path="albums" element={<Albums />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </AdminLayout>
  );
}
