import API from "./api";

export async function postGoogleCredential(credential) {
  const res = await API.post("/auth/google", { credential });
  if (res?.data?.token) {
    localStorage.setItem("dotin_token", res.data.token);
  }
  if (res?.data?.user) {
    localStorage.setItem("dotin_user", JSON.stringify(res.data.user));
    window.dispatchEvent(new CustomEvent("dotin_user_updated", { detail: res.data.user }));
  }
  return res.data;
}

export async function fetchMe() {
  const res = await API.get("/auth/me");
  return res.data;
}

export async function postLogout() {
  await API.post("/auth/logout");
  localStorage.removeItem("dotin_token");
  localStorage.removeItem("dotin_user");
  localStorage.removeItem("dotin_role");
}
