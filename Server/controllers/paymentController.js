import Razorpay from "razorpay";
import crypto from "crypto";
import PremiumPayment from "../models/premiumUser.js";

export const createOrder = async (req, res) => {
  try {
    const { amount, plan, userId } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: "order_" + Date.now()
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
      userId
    });
  } catch {
    res.status(500).json({ success: false });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, plan, amount } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "payment verification failed" });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumPlan: plan,
      premiumExpiresAt: expiresAt
    });

    await PremiumPayment.create({
      userId,
      plan,
      amount,
      currency: "INR",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      expiresAt
    });

    res.json({ success: true, message: "premium activated" });
  } catch {
    res.status(500).json({ message: "verification failed" });
  }
};
