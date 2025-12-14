import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("dotin_token");
    localStorage.removeItem("dotin_user");
    navigate("/login");
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="font-semibold">Dashboard</div>
      <button
        onClick={logout}
        className="bg-black text-white px-4 py-1.5 rounded-full"
      >
        Logout
      </button>
    </header>
  );
}
