import { useState } from "react";
import { createOrder, verifyPayment } from "../api/paymentService";
import { useNavigate } from "react-router-dom";

export default function Premium() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function loadRazorpay() {
    if (window.Razorpay) return true;
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  }

  async function handleBuy(plan) {
    setLoading(true);
    setErr("");

    try {
      await loadRazorpay();

      const amount = plan === "monthly" ? 99 : 249;
      const order = await createOrder(amount, plan);

      const user = JSON.parse(localStorage.getItem("dotin_user"));

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Dot-In Premium",
        description: "Unlimited music streaming",
        order_id: order.orderId,

        handler: async (res) => {
          const data = await verifyPayment({
            razorpay_order_id: res.razorpay_order_id,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_signature: res.razorpay_signature,
            plan,
            amount
          });

          if (data?.user) {
            localStorage.setItem("dotin_user", JSON.stringify(data.user));
            window.dispatchEvent(
              new CustomEvent("dotin_user_updated", { detail: data.user })
            );
            navigate("/");
          }
        },

        prefill: {
          name: user?.name,
          email: user?.email
        },

        theme: { color: "#10B981" }
      };

      new window.Razorpay(options).open();
    } catch (e) {
      setErr(e.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">
        Upgrade to Premium
      </h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {[
          { plan: "monthly", price: 99, label: "Monthly" },
          { plan: "yearly", price: 249, label: "Yearly" }
        ].map(p => (
          <div
            key={p.plan}
            className="rounded-3xl border bg-white shadow-sm p-8 flex flex-col"
          >
            <h2 className="text-xl font-semibold">{p.label} Plan</h2>
            <p className="text-4xl font-bold mt-4">
              ₹{p.price}
              <span className="text-sm text-gray-500">
                /{p.plan === "monthly" ? "month" : "year"}
              </span>
            </p>

            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li>✔ Ad-free listening</li>
              <li>✔ Unlimited skips</li>
              <li>✔ High quality audio</li>
            </ul>

            <button
              disabled={loading}
              onClick={() => handleBuy(p.plan)}
              className="mt-8 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
            >
              {loading ? "Processing…" : "Get Premium"}
            </button>
          </div>
        ))}
      </div>

      {err && (
        <p className="text-center text-red-500 mt-6">{err}</p>
      )}
    </div>
  );
}
