import express from "express"

import protect from "../middleware/authMiddleware.js"
import { createEvent, deleteEvent, getEvent, getEvents, updateEvent } from "../controllers/eventController.js"

const router = express.Router()

router.get("/",getEvents)
router.get("/:id",getEvent)
router.post("/", protect, createEvent)
router.delete("/:id",protect, deleteEvent)
router.put("/:id", protect,updateEvent)

export default router;