import express from "express";
import { getAttendanceStats, verifyTicket } from "../controllers/qrController.js";
import protect from "../middleware/authMiddleware.js";
import organizerOnly from "../middleware/organizerOnly.js";

const router = express.Router();

router.post("/verify", protect, organizerOnly, verifyTicket);
router.get("/attendance/:eventId", protect, organizerOnly, getAttendanceStats);

export default router;