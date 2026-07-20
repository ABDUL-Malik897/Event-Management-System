import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

export const verifyTicket = async (req, res) => {

    try {
        const { ticketId } = req.body;
        if (!ticketId) {
            return res.status(400).json({
                success: false,
                message: "Ticket ID is required"
            });
        }
        const booking = await Booking.findOne({
            "tickets.ticketId": ticketId,
            bookingStatus: "Booked"
        })
        .populate("user", "username email")
        .populate("event", "title date venue");
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Invalid Ticket"
            });
        }
        const event = await Event.findById(booking.event._id);
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }
        const ticket = booking.tickets.find(
            (t) => t.ticketId === ticketId
        );
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket Not Found"
            });
        }
        if (ticket.checkedIn) {
            return res.status(400).json({
                success: false,
                message: "Ticket Already Checked In",
                ticket
            });
        }
        ticket.checkedIn = true;
        ticket.checkedInAt = new Date();
        await booking.save();
        return res.status(200).json({
            success: true,
            message: "Check-in Successful",
            booking,
            ticket
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const getAttendanceStats = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event Not Found"
            });
        }
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not Authorized"
            });
        }
        const bookings = await Booking.find({
            event: eventId,
            bookingStatus: "Booked"
        }).populate("user", 'username')
        const totalTickets = bookings.reduce(
            (sum, booking) => sum + booking.tickets.length,
            0
        );
        const recentCheckIns = [];
        bookings.forEach((booking) => {
            booking.tickets.forEach((ticket) => {
                if (ticket.checkedIn) {
                    recentCheckIns.push({
                        username: booking.user.username,
                        seatNumber: ticket.seatNumber,
                        checkedInAt: ticket.checkedInAt
                    });
                }
            });
        });
        let checkedIn = 0;
        bookings.forEach((booking) => {
            checkedIn += booking.tickets.filter(
                (ticket) => ticket.checkedIn
            ).length;
        });
        recentCheckIns.sort((a, b) => {
            return new Date(b.checkedInAt) - new Date(a.checkedInAt);
        });
        const pending = totalTickets - checkedIn;
        const attendance =
            totalTickets === 0
                ? 0
                : Number(((checkedIn / totalTickets) * 100).toFixed(2));
        res.status(200).json({
            success: true,
            stats: {
                totalTickets,
                checkedIn,
                pending,
                attendance,
                recentCheckIns
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};