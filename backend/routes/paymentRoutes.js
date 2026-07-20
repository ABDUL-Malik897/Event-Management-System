import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createOrder, getMyPayments, paymentFailed, refundPayment, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.post("/failed", protect, paymentFailed);
router.get("/my", protect, getMyPayments);
router.post("/refund/:bookingId", protect, refundPayment);

export default router;