import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            required: true,
            unique: true
        },

        qrCode: {
            type: String,
            default: ""
        },

        checkedIn: {
            type: Boolean,
            default: false
        },

        checkedInAt: {
            type: Date,
            default: null
        },

        seatNumber: {
            type: String,
            default: ""
        }
    },
    {
        _id: false
    }
);

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        tickets: {
            type: [ticketSchema],
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        ticketPrice: {
            type: Number,
            required: true
        },

        totalAmount: {
            type: Number,
            required: true
        },

        bookingStatus: {
            type: String,
            enum: ["Booked", "Cancelled"],
            default: "Booked"
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed","Refunded"],
            default: "Pending"
        },

        razorpayOrderId: {
            type: String,
            unique: true,
            sparse: true
        },

        razorpayPaymentId: {
            type: String,
            sparse : true
        },
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;