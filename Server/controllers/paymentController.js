import Razorpay from "razorpay";
import crypto from "crypto";
import PremiumPayment from "../models/premiumUser.js";
import User from "../models/User.js";

export const createOrder = async (req, res) => {
  try {
    const { amount, plan } = req.body;
    const userId = req.user.id;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: "order_" + Date.now()
    });

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan
    });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ success: false, message: "Order creation failed" });
  }
};
;
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      amount
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ message: "Missing payment fields" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (razorpay_signature && expected !== razorpay_signature) {
      return res.status(400).json({ message: "payment verification failed" });
    }
const userId = req.user?.id;
if (!userId) return res.status(401).json({ message: "Unauthorized" });


    const expiresAt = new Date();

if (plan === "yearly") {
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);
} else {
  expiresAt.setMonth(expiresAt.getMonth() + 1);
}


    const updated = await User.findByIdAndUpdate(
      userId,
      {
        isPremium: true,
        premiumPlan: plan,
        premiumExpiresAt: expiresAt
      },
      {
        new: true,
        select: "_id name email avatar role isPremium premiumPlan premiumExpiresAt"
      }
    );

    await PremiumPayment.create({
      userId,
      plan,
      amount: Number(amount || 0),
      currency: "INR",
      orderId: razorpay_order_id || "demo-order",
      paymentId: razorpay_payment_id || "demo-payment",
      signature: razorpay_signature || "demo-sign",
      expiresAt
    });

    return res.json({ success: true, message: "premium activated", user: updated });
  } catch (err) {
    console.error("verifyPayment error:", err);
    return res.status(500).json({ message: "verification failed", error: err.message });
  }
};


export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "_id name email avatar role isPremium premiumPlan premiumExpiresAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};


export const getAllPayments = async (req, res) => {
  try {
    const payments = await PremiumPayment.find().sort({ createdAt: -1 }).populate("userId", "name email").lean();
    return res.json({ payments });
  } catch (err) {
    console.error("getAllPayments error:", err);
    return res.status(500).json({ message: "Failed to fetch payments" });
  }
};


