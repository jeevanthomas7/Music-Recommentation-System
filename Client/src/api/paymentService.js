import API from "./api";

function authHeader() {
  const token = localStorage.getItem("dotin_token");
  if (!token) throw new Error("Login expired");
  return {
    Authorization: `Bearer ${token}`
  };
}

export async function createOrder(amount, plan) {
  const res = await API.post(
    "/payments/create-order",
    { amount, plan },
    { headers: authHeader() }
  );
  return res.data;
}

export async function verifyPayment(payload) {
  const res = await API.post(
    "/payments/verify",
    payload,
    { headers: authHeader() }
  );
  return res.data;
}

export async function fetchMyPayments() {
  const res = await API.get(
    "/payments/my",
    { headers: authHeader() }
  );
  return res.data;
}
