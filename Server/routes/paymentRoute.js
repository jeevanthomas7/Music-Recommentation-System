import express from "express";
import { createOrder, verifyPayment, getMyPayments, getAllPayments } from "../controllers/paymentController.js";
import { auth, admin } from "../middleware/authMiddileware.js";

const router = express.Router();

router.post("/create-order", auth, createOrder);
router.post("/verify", auth, verifyPayment);
router.get("/my", auth, getMyPayments);
router.get("/all",auth, admin, getAllPayments);

export default router;
