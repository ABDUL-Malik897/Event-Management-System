import express from "express";
import { createMembershipOrder, getCurrentMembership, getMembershipPaymentHistory, verifyMembershipPayment } from "../controllers/membershipPaymentController.js";
import protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, createMembershipOrder);
router.post("/verify", protect, verifyMembershipPayment);
router.get("/history", protect, getMembershipPaymentHistory);
router.get("/current", protect, getCurrentMembership);

export default router;