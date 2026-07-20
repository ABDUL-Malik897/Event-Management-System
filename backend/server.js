import "./config/env.js";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import organizerReqRoutes from "./routes/organizerReqRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminDashboardRoutes from "./routes/AdminDasboardRoutes.js";
import membershipPaymentRoutes from "./routes/membershipPaymentRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import path from "path";


const app = express();

connectDB();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);

app.use(express.json());

app.use(
    "/uploads",
    express.static(
        path.join(
            process.cwd(),
            "uploads"
        )
    )
);


// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/organizer", organizerReqRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/membership-payment",  membershipPaymentRoutes)
app.use("/api/profile", profileRoutes)


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.send(
        "EventHub API Running..."
    );

});


// ==========================================
// START SERVER
// ==========================================

const port =
    process.env.PORT || 4000;


app.listen(
    port,
    () => {

        console.log(
            `Server running on port ${port}`
        );

    }
);