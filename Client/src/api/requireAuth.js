import toast from "react-hot-toast";

export function requireAuth(action) {
  const token = localStorage.getItem("dotin_token");

  if (!token) {
    toast.error("Please login to continue");
    return;
  }

  action();
}
