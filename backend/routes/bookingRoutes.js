import express from 'express'
import protect from "../middleware/authMiddleware.js"
import { bookTicket, cancelBooking, getBookingById, myBooking } from '../controllers/bookingController.js'

const router = express.Router()

router.post("/",protect,bookTicket)
router.get("/my",protect,myBooking)
router.put("/:id/cancel", protect,cancelBooking)
router.get("/:id", protect, getBookingById)

export default router;