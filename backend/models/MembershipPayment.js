import mongoose from "mongoose";

const membershipPaymentSchema =
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            razorpayOrderId: {
                type: String,
                required: true,
                unique: true
            },

            razorpayPaymentId: {
                type: String,
                default: null,
                unique: true,
                sparse: true
            },

            plan: {
                type: String,
                enum: [
                    "Monthly",
                    "Yearly"
                ],
                required: true
            },

            amount: {
                type: Number,
                required: true
            },

            duration: {
                type: Number,
                required: true
            },

            paymentStatus: {
                type: String,
                enum: [
                    "Created",
                    "Paid",
                    "Failed"
                ],
                default: "Created"
            },

            membershipStartDate: {
                type: Date,
                default: null
            },

            membershipExpiryDate: {
                type: Date,
                default: null
            },

            paidAt: {
                type: Date,
                default: null
            }
        },
        {
            timestamps: true
        }
    );


const MembershipPayment =
    mongoose.model(
        "MembershipPayment",
        membershipPaymentSchema
    );


export default MembershipPayment;