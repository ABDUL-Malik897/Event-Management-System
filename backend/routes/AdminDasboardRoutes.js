import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminOnly.js"
import { getAdminDashboard } from "../controllers/adminController.js";


const router = express.Router();


router.get(
    "/dashboard",
    protect,
    adminMiddleware,
    getAdminDashboard
);


export default router;