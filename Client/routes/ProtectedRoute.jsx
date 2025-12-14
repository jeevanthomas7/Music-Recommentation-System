import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("dotin_token");
  const location = useLocation();

  if (!token) {
    toast.error("Please login to continue");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
