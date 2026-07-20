import express from "express";
import { updateProfilePicture } from "../controllers/profileController.js";
import uploadProfilePic  from "../middleware/uploadProfilePic.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/picture", protect, uploadProfilePic.single("profilePic"), updateProfilePicture);

export default router;