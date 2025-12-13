import React, { useState } from "react";
import { createOrder, verifyPayment } from "../api/paymentService";
import { useNavigate } from "react-router-dom";

export default function Premium() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  function loadRazorpay() {
    if (window.Razorpay) return Promise.resolve(true);
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  }

 async function handleBuy(plan) {
  setLoading(true);
  setErr("");

  try {
    const token = localStorage.getItem("dotin_token");
    if (!token) throw new Error("Login expired. Please login again");

    const raw = localStorage.getItem("dotin_user");
    const user = raw ? JSON.parse(raw) : null;
    const userId = user?.id || user?._id;

    if (!userId) throw new Error("User not logged in");

    await loadRazorpay();

    const amount = plan === "monthly" ? 99 : 249;
const data = await createOrder(amount, plan);



      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Dot-In Premium",
        description: plan === "monthly" ? "Monthly Subscription" : "Yearly Subscription",
        order_id: data.orderId,

        handler: async (response) => {
          try {
          const payload = {
  razorpay_order_id: response.razorpay_order_id,
  razorpay_payment_id: response.razorpay_payment_id,
  razorpay_signature: response.razorpay_signature,
  plan,
  amount
};
;

            const res = await verifyPayment(payload);
if (res?.user) {
  const norm = {
    id: res.user._id,
    name: res.user.name,
    email: res.user.email,
    avatar: res.user.avatar || res.user.picture,
    isPremium: true,
    premiumPlan: res.user.premiumPlan,
    premiumExpiresAt: res.user.premiumExpiresAt
  };
  console.log("VERIFY RESPONSE:", res);


  localStorage.setItem("dotin_user", JSON.stringify(norm));

  window.dispatchEvent(
  new CustomEvent("dotin_user_updated", { detail: norm })
);


  navigate("/", { replace: true });
}

          } catch (error) {
            console.error("Payment verify error:", error);
            setErr("Verification failed");
          }
        },

        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#10B981" }
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error(error);
      setErr(error.message || "Payment error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8">Go Premium</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="p-6 rounded-2xl border border-gray-200 shadow bg-white">
          <h2 className="text-xl font-semibold">Monthly Plan</h2>
          <p className="text-3xl font-bold mt-3">₹99 <span className="text-sm text-gray-500">/month</span></p>

          <button
            disabled={loading}
            onClick={() => handleBuy("monthly")}
            className="mt-6 w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold"
          >
            {loading ? "Processing…" : "Buy Monthly"}
          </button>
        </div>

        <div className="p-6 rounded-2xl border border-gray-200 shadow bg-white">
          <h2 className="text-xl font-semibold">Yearly Plan</h2>
          <p className="text-3xl font-bold mt-3">₹249 <span className="text-sm text-gray-500">/year</span></p>

          <button
            disabled={loading}
            onClick={() => handleBuy("yearly")}
            className="mt-6 w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold"
          >
            {loading ? "Processing…" : "Buy Yearly"}
          </button>
        </div>

      </div>

      {err && <p className="text-center text-red-500 mt-6">{err}</p>}
    </div>
  );
}
