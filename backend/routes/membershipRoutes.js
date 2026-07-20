import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createMembership,  getMembership,} from "../controllers/membershipController.js";

const router = express.Router();
router.post("/", protect, createMembership);
router.get("/", protect, getMembership);

export default router;