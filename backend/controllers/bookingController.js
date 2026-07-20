import mongoose from "mongoose";
import QRCode from "qrcode";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

export const bookTicket = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { eventId, quantity } = req.body;
        if (!eventId || !Number.isInteger(quantity) || quantity < 1) {
            await session.abortTransaction();

            return res.status(400).json({
                success: false,
                message: "Invalid booking request"
            });
        }
        const event = await Event.findById(eventId).session(session);
        if (!event) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        if (eventDate < today) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Event has already ended"
            });
        }
        if (event.availableSeats < quantity) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Not enough seats available"
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
                    event: event._id,
                    bookingStatus: "Booked"
                }
            },
            {
                $unwind: "$tickets"
            },
            {
                $project: {
                    seatNumber: "$tickets.seatNumber"
                }
            }
        ]).session(session);

        const usedSeats = new Set(
            existingBookedSeats.map(seat => seat.seatNumber)
        );

        const tickets = [];
        let seatCounter = 1;
        for (let i = 0; i < quantity; i++) {
            while (usedSeats.has(`S-${seatCounter.toString().padStart(3, "0")}`)) {
                seatCounter++;
            }
            const seatNumber = `S-${seatCounter.toString().padStart(3, "0")}`;
            usedSeats.add(seatNumber);
            const ticketId = new mongoose.Types.ObjectId().toString();
            const qrData = JSON.stringify({
                ticketId
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

        const totalAmount = event.ticketPrice * quantity;
        const booking = await Booking.create(
            [
                {
                    user: req.user._id,
                    event: event._id,
                    tickets,
                    quantity,
                    ticketPrice: event.ticketPrice,
                    totalAmount,
                    bookingStatus: "Booked",
                    paymentStatus: "Pending",
                }
            ],
            { session }
        );
        event.availableSeats -= quantity;
        await event.save({ session });
        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: "Tickets booked successfully",
            booking: booking[0],
            availableSeats: event.availableSeats
        });
    } catch (error) {
        await session.abortTransaction();
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    } finally {
        session.endSession();
    }
};

export const myBooking = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id
        })
        .populate(
            "event",
            "title date venue banner ticketPrice"
        )
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const cancelBooking = async (req, res) => {

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const booking = await Booking.findById(req.params.id).session(session);
        if (!booking) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        if (booking.user.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            return res.status(403).json({
                success: false,
                message: "Not Authorized"
            });
        }
        if (booking.bookingStatus === "Cancelled") {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Booking already cancelled"
            });
        }

        if (booking.paymentStatus === "Paid") {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Paid bookings cannot be cancelled directly. Please request a refund."
            });
        }
        const event = await Event.findById(booking.event).session(session);
        if (!event) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }
        event.availableSeats += booking.quantity;
        await event.save({ session });
        booking.bookingStatus = "Cancelled";
        await booking.save({ session });
        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully"
        });
    } catch (error) {
        await session.abortTransaction();
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    } finally {
        session.endSession();
    }
};

export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate(
                "event",
                "title date venue banner ticketPrice description"
            );
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }
        res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};