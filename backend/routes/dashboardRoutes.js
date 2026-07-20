import express from "express";
import protect from "../middleware/authMiddleware.js";
import organizerOnly from "../middleware/organizerOnly.js";
import { getEventAttendees, getOrganizerEvents, organizerDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", protect, organizerOnly, organizerDashboard);
router.get("/events", protect, organizerOnly, getOrganizerEvents);
router.get("/attendees/:eventId", protect, organizerOnly, getEventAttendees);

export default router;