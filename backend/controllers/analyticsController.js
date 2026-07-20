import Event from "../models/Event.js";
import Booking from "../models/Booking.js";

export const getAnalytics = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user._id });
        const eventIds = events.map(event => event._id);
        const bookings = await Booking.find({
            event: { $in: eventIds }, bookingStatus : "Booked"
        }).populate("event", "title");

        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
        const totalTicketsSold = bookings.reduce((sum, booking) => sum + booking.quantity, 0);
        const averageTickets = events.length > 0 ? (totalTicketsSold / events.length).toFixed(2) : 0;
        const platformCommission = Number((totalRevenue * 0.05).toFixed(2));
        const organizerEarnings = Number((totalRevenue - platformCommission).toFixed(2));

        const monthlyRevenue = {};
        bookings.forEach((booking) => {
            const month = new Date(booking.createdAt).toLocaleString("default", { month: "long" });
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + booking.totalAmount;
        });

        const eventAnalytics = events.map(event => {
            const eventBookings = bookings.filter(booking => booking.event._id.toString() === event._id.toString());
            const revenue = eventBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
            const ticketsSold = eventBookings.reduce((sum, booking) => sum + booking.quantity, 0);
            const occupancy = event.totalSeats > 0 ? ((ticketsSold / event.totalSeats) * 100).toFixed(2) : 0;
            return {
                title: event.title,
                revenue,
                ticketsSold,
                occupancy
            };
        });
        eventAnalytics.sort((a, b) => b.revenue - a.revenue);
        res.status(200).json({
            success: true,
            analytics: {
                totalEvents: events.length,
                totalRevenue,
                totalTicketsSold,
                averageTickets,
                platformCommission,
                organizerEarnings,
                monthlyRevenue,
                topEvents: eventAnalytics.slice(0, 5)
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

export const getEventAnalytics = async (req, res) => {
    try {
        const events = await Event.find({
            organizer: req.user._id
        });

        const analytics = [];
        for (const event of events) {
            const bookings = await Booking.find({
                event: event._id,
                bookingStatus : "Booked"
            });

            const ticketsSold = bookings.reduce((sum, booking) => sum + booking.quantity, 0);
            const revenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
            const occupancy = event.totalSeats > 0 ? ((ticketsSold / event.totalSeats) * 100).toFixed(2) : 0;

            analytics.push({
                eventId: event._id,
                title: event.title,
                ticketsSold,
                revenue,
                occupancy
            });
        }

        res.status(200).json({
            success: true,
            events: analytics
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};