import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-6xl font-bold text-red-600">403</h1>

      <p className="mt-4 text-xl font-semibold text-gray-900">
        Unauthorized
      </p>

      <p className="mt-2 text-gray-500 text-center max-w-md">
        You are logged in as a normal user.  
        Admin access is restricted.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 rounded-full bg-gray-900 text-white hover:bg-black transition"
      >
        Back to Home
      </button>
    </div>
  );
}
