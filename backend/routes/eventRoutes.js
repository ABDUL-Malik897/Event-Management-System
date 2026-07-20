import express from "express"
import protect from "../middleware/authMiddleware.js"
import { createEvent, deleteEvent, getEvent, getEvents, updateEvent } from "../controllers/eventController.js"
import organizerOnly from "../middleware/organizerOnly.js"
import checkMembership from "../middleware/checkMembership.js"

const router = express.Router()

router.get("/",getEvents)
router.get("/:id",getEvent)
router.post("/", protect,checkMembership,organizerOnly ,createEvent)
router.delete("/:id",protect, organizerOnly, deleteEvent)
router.put("/:id", protect, organizerOnly, updateEvent)


export default router;