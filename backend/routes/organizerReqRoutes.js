import express from 'express'
import protect from "../middleware/authMiddleware.js"
import { applyOrganizer, approveOrganizer, getMyApplication, getPendingReq, rejectOrganizer } from '../controllers/OrganizerReqController.js'
import adminOnly from "../middleware/adminOnly.js"

const router = express.Router()

router.post("/apply", protect , applyOrganizer)
router.get('/status', protect , getMyApplication)
router.get('/pending', protect, adminOnly, getPendingReq)
router.put("/:id/approve", protect, adminOnly, approveOrganizer)
router.put("/:id/reject", protect, adminOnly, rejectOrganizer)


export default router