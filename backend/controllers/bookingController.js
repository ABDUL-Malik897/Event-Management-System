import mongoose from "mongoose";
import QRCode from "qrcode"
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

export const bookTicket = async (req ,res) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const  { eventId , quantity } = req.body;

        if (!eventId || !Number.isInteger(quantity) || quantity < 1) {
            await session.abortTransaction()
            return res.status(400).json({
                success : false,
                message : "Invalid Booking request"
            })
        }

        const event = await Event.findById(eventId).session(session)
        if (!event) {
            await session.abortTransaction()
            return res.status(404).json({
                success : false,
                message : "Event Not Found"
            })
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        if (eventDate < today) {
            await session.abortTransaction()
            return res.status(400).json({
                success : false,
                message : "Event has already ended"
            })
        }
        if (event.availableSeats < quantity) {
            await session.abortTransaction()
            return res.status(400).json({
                success : false,
                message : "Not Enough Seats Available"
            })
        }

        const existingBooking = await Booking.findOne({
                user: req.user._id,
                event: event._id,
                bookingStatus: "Booked",
            }).session(session);
        if (existingBooking) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "You have already booked this event",
            });
        }

        const tickets = []
        for (let i = 0; i < quantity; i++) {
            const ticketId = new mongoose.Types.ObjectId()
            const qrData = JSON.stringify({
                ticketId, eventId : event._id, userId : req.user._id
            })

            const qrCode = await QRCode.toDataURL(qrData)
            tickets.push({ qrCode , checkedIn : false , seatNumber : ""})
        }

        const totalAmount = event.ticketPrice * quantity
        const booking = await Booking.create(
            [
                {
                user : req.user._id,
                event : event._id,
                tickets,
                totalAmount,
                paymentStatus : "Pending"
                },
            ], { session }
        )

        event.availableSeats -= quantity        
        await event.save({ session })
        await session.commitTransaction()

        res.status(201).json({
            success : true,
            message : "Booked Successfully",
            booking : booking[0],
            availableSeats : event.availableSeats
        })
    } catch (error) {
        await session.abortTransaction()
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    } finally {
        session.endSession()
    }
};

export const myBooking = async (req ,res) => {
    try {
        const bookings = await Booking.find({
            user : req.user._id
        }).populate("event" , "title date venue banner ticketPrice").sort({ createdAt : -1 })

        res.status(200).json({
            success : true,
            count : bookings.length,
            bookings
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
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
            message: "Booking Not Found",
        });
        }
        if (booking.user.toString() !== req.user._id.toString()) {
        await session.abortTransaction();
        return res.status(403).json({
            success: false,
            message: "Not Authorized",
        });
        }
        if (booking.bookingStatus === "Cancelled") {
        await session.abortTransaction();
        return res.status(400).json({
            success: false,
            message: "Booking Already Cancelled",
        });
        }

        const event = await Event.findById(booking.event).session(session);
        if (!event) {
        await session.abortTransaction();
        return res.status(404).json({
            success: false,
            message: "Event Not Found",
        });
        }
        event.availableSeats += booking.tickets.length;
        await event.save({ session });
        booking.bookingStatus = "Cancelled";
        await booking.save({ session });
        await session.commitTransaction();
        res.status(200).json({
        success: true,
        message: "Booking Cancelled Successfully",
        });
    } catch (error) {
        await session.abortTransaction();
        console.log(error);
        res.status(500).json({
        success: false,
        message: "Server Error",
        });
    } finally {
        await session.endSession();
    }
};