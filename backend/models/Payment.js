import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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

        razorpayOrderId: {
            type: String,
            required: true,
            unique: true
        },

        razorpayPaymentId: {
            type: String,
            default: null
        },

        amount: {
            type: Number,
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Created",
                "Paid",
                "Failed",
                "Refunded"
            ],
            default: "Created"
        },

        failureReason: {
            type: String,
            default: ""
        },

        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            default: null
        },
        refundId: {
            type: String,
            default: null
        },

        refundAmount: {
            type: Number,
            default: 0
        },

        refundedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Payment = mongoose.model(
    "Payment",
    paymentSchema
);

export default Payment;