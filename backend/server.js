import express from 'express'
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';


dotenv.config()
const app = express()
connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use('/api/booking',bookingRoutes)

app.get("/",(req ,res) => {
    res.send("EventHub API Running...")
})

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})