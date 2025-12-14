import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdminRoute() {
  const raw = localStorage.getItem("dotin_user");

  if (!raw) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(raw);

  
  if (user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }


  return <Outlet />;
}
