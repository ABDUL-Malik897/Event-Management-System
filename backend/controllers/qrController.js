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
            .populate("user","username email")
            .populate("event","title date time venue organizer");
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Invalid Ticket"
            });
        }
        if (!booking.event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }
        const eventOrganizerId = booking.event.organizer?.toString();
        const loggedInUserId = req.user._id.toString();
        if (
            req.user.role !== "admin" &&
            eventOrganizerId !== loggedInUserId
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to check in tickets for this event"
            });
        }
        const ticket = booking.tickets.find((ticket) => ticket.ticketId === ticketId);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        if (ticket.checkedIn) {
            return res.status(400).json({
                success: false,
                message: "Ticket already checked in",
                ticket
            });
        }
        ticket.checkedIn = true;

        ticket.checkedInAt = new Date();
        await booking.save();

        return res.status(200).json({
            success: true,
            message: "Check-in successful",
            booking,
            ticket
        });
    } catch (error) {
        console.log(
            "Verify Ticket Error:",
            error
        );
        return res.status(500).json({
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