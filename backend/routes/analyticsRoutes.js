import express from "express";
import protect from "../middleware/authMiddleware.js";
import organizerOnly from "../middleware/organizerOnly.js";
import { getAnalytics, getEventAnalytics} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/", protect, organizerOnly,  getAnalytics);
router.get("/events", protect, organizerOnly, getEventAnalytics);

export default router;