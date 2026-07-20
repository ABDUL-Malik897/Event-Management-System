import crypto from "crypto";
import mongoose from "mongoose";
import QRCode from "qrcode";

import razorpay from "../config/razorpay.js";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

export const createOrder = async (req, res) => {
    try {
        const { eventId, quantity } = req.body;

        if (!eventId || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment request"
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event Not Found"
            });
        }

        const existingBooking = await Booking.findOne({
            user: req.user._id,
            event: eventId,
            bookingStatus: "Booked"
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "You have already booked this event"
            });
        }

        if (event.availableSeats < quantity) {
            return res.status(400).json({
                success: false,
                message: "Not Enough Seats Available"
            });
        }

        const totalAmount = Number(event.ticketPrice) * quantity;

        const options = {
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,

            notes: {
                eventId: event._id.toString(),
                quantity: quantity.toString(),
                userId: req.user._id.toString()
            }
        };

        const order = await razorpay.orders.create(options);

        await Payment.create({
            user: req.user._id,
            event: event._id,
            razorpayOrderId: order.id,
            amount: totalAmount,
            quantity,
            status: "Created"
        });

        res.status(200).json({
            success: true,
            message: "Payment order created successfully",
            order,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.log("Create Razorpay Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create payment order"
        });
    }
};

export const verifyPayment = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            eventId,
            quantity
        } = req.body;


        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !eventId ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment details"
            });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }
        session.startTransaction();

        const existingPayment = await Booking.findOne({
                razorpayPaymentId: razorpay_payment_id
            }).session(session);

        if (existingPayment) {
            await session.abortTransaction();
            return res.status(200).json({
                success: true,
                message: "Booking already exists for this payment",
                booking: existingPayment
            });
        }
        const existingOrder = await Booking.findOne({razorpayOrderId: razorpay_order_id}).session(session);

        if (existingOrder) {
            await session.abortTransaction();
            return res.status(200).json({
                success: true,
                message: "Booking already exists for this order",
                booking: existingOrder
            });
        }

        const event = await Event.findById(eventId).session(session);
        if (!event) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Event Not Found"
            });
        }

        const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
        if (razorpayOrder.notes?.eventId !== eventId || Number(razorpayOrder.notes?.quantity) !== quantity || razorpayOrder.notes?.userId !== req.user._id.toString()) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message:"Payment order details mismatch"
            });
        }
        const expectedAmount = Math.round(Number(event.ticketPrice) * quantity * 100);

        if (Number(razorpayOrder.amount) !== expectedAmount) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Payment amount mismatch"
            });
        }

        if (event.availableSeats < quantity) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Not Enough Seats Available"
            });
        }

        const existingBooking = await Booking.findOne({
                user: req.user._id,
                event: event._id,
                bookingStatus: "Booked"
            }).session(session);
        if (existingBooking) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "You have already booked this event"
            });
        }

        const existingBookedSeats = await Booking.aggregate([
                {
                    $match: {
                        event:
                            event._id,
                        bookingStatus:
                            "Booked"
                    }
                },
                {
                    $unwind:
                        "$tickets"
                },
                {
                    $match: {
                        "tickets.seatNumber": {
                            $nin: [
                                "",
                                null
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        seatNumber:
                            "$tickets.seatNumber"
                    }
                }
            ]).session(session);

            const usedSeats = new Set(existingBookedSeats.map((seat) => seat.seatNumber));

        const tickets = [];
        let seatCounter = 1;
        for (let i = 0; i < quantity; i++) {
            let seatNumber = `S-${seatCounter.toString().padStart(3,"0")}`;

            while (usedSeats.has(seatNumber)) {
                seatCounter++;
                seatNumber = `S-${seatCounter.toString().padStart(3, "0")}`;
            }
            usedSeats.add(seatNumber);
            const ticketId =  new mongoose.Types.ObjectId().toString();


            const qrData = JSON.stringify({
                    ticketId,
                    eventId: event._id.toString(),
                    userId: req.user._id.toString()
                });
            const qrCode = await QRCode.toDataURL(qrData);
            tickets.push({
                ticketId,
                qrCode,
                checkedIn: false,
                checkedInAt: null,
                seatNumber
            });
            seatCounter++;
        }

        const ticketPrice = Number(event.ticketPrice);
        const totalAmount = ticketPrice * quantity;

        const booking = await Booking.create(
                [
                    {
                        user: req.user._id,
                        event: event._id,
                        quantity,
                        ticketPrice,
                        tickets,
                        totalAmount,
                        bookingStatus: "Booked",
                        paymentStatus: "Paid",
                        razorpayOrderId: razorpay_order_id,
                        razorpayPaymentId: razorpay_payment_id
                    }
                ],
                {
                    session
                }
            );

        await Payment.findOneAndUpdate(
            {
                razorpayOrderId: razorpay_order_id
            },
            {
                razorpayPaymentId: razorpay_payment_id,
                status: "Paid",
                booking: booking[0]._id
            },
            {
                session
            }
        );

        event.availableSeats -= quantity;
        await event.save({session});
        await session.commitTransaction();
        return res.status(201).json({
            success: true,
            message: "Payment verified and booking created successfully",
            booking: booking[0]
        })
    } catch (error) {
        if (
            session.inTransaction()
        ) {
            await session.abortTransaction();
        }
        console.error("Payment Verification Error:",error);
        return res.status(500).json({
            success: false,
            message:"Server Error"
        });
    } finally {
        await session.endSession();
    }
};

export const paymentFailed = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            failureReason
        } = req.body;

        if (!razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Razorpay Order ID is required"
            });
        }

        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
            user: req.user._id
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found"
            });
        }

        if (payment.status === "Paid") {
            return res.status(400).json({
                success: false,
                message: "Paid payment cannot be marked as failed"
            });
        }

        payment.status = "Failed";

        if (razorpay_payment_id) {
            payment.razorpayPaymentId = razorpay_payment_id;
        }

        payment.failureReason =
            failureReason || "Payment failed";

        await payment.save();

        return res.status(200).json({
            success: true,
            message: "Payment failure recorded successfully"
        });

    } catch (error) {
        console.log("Payment Failed Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({
            user: req.user._id
        })
        .populate(
            "event",
            "title date venue banner"
        )
        .populate(
            "booking",
            "_id bookingStatus"
        )
        .sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {

        console.log(
            "Get Payment History Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

export const refundPayment = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(
            bookingId
        );
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking Not Found"
            });
        }
        if (
            booking.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Not Authorized"
            });
        }

        if (booking.bookingStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking already cancelled"
            });
        }

        if (booking.paymentStatus !== "Paid") {
            return res.status(400).json({
                success: false,
                message:
                    "Only paid bookings can be refunded"
            });
        }

        const payment = await Payment.findOne({
            booking: booking._id,
            status: "Paid"
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Paid payment record not found"
            });
        }

        const refund = await razorpay.payments.refund(
            booking.razorpayPaymentId,
            {
                amount: Math.round(
                    booking.totalAmount * 100
                )
            }
        );

        session.startTransaction();

        booking.bookingStatus = "Cancelled";
        booking.paymentStatus = "Refunded";

        await booking.save({
            session
        });


        payment.status = "Refunded";
        payment.refundId = refund.id;
        payment.refundAmount =
            booking.totalAmount;
        payment.refundedAt = new Date();

        await payment.save({
            session
        });

        const event = await Event.findById(
            booking.event
        ).session(session);

        if (!event) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Event Not Found"
            });
        }
        event.availableSeats += booking.tickets.length;
        await event.save({
            session
        });
        await session.commitTransaction();
        return res.status(200).json({
            success: true,
            message:
                "Booking cancelled and refund initiated successfully",
            refund
        });
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        console.log("Refund Payment Error:", error);
        return res.status(500).json({
            success: false,
            message: error.error?.description || "Refund failed"
        });
    } finally {
        await session.endSession();
    }
};