import mongoose from "mongoose";

const premiumPaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    plan: String,
    orderId: String,
    paymentId: String,
    signature: String,
    amount: Number,
    currency: String,
    status: { type: String, default: "success" },
    expiresAt: Date
  },
  { timestamps: true }
);

const PremiumPayment = mongoose.model("PremiumPayment", premiumPaymentSchema);

export default PremiumPayment;
