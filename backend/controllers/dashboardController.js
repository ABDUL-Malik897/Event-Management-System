import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

export const organizerDashboard = async (req ,res) => {
    try {
        const orgainzerId = req.user._id
        const events = await Event.find({
            organizer : orgainzerId
        })
        const totalEvents = events.length
        const eventIds = events.map(event => event._id)
        const bookings = await Booking.find({
            event : {
                $in : eventIds
            },
            bookingStatus : "Booked"
        })
        const ticketsSold = bookings.reduce((total , booking) => total + booking.quantity,0)
        const revenue = bookings.reduce((total ,  booking) => total + booking.totalAmount,0)
        const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length
        res.status(200).json({
            success : true,
            stats : {
                totalEvents,
                ticketsSold,
                revenue,
                upcomingEvents
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const getOrganizerEvents = async (req, res) => {
    try {
        const events = await Event.find({
            organizer: req.user._id
        }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            events
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const getEventAttendees = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const bookings = await Booking.find({
            event: eventId
        })
            .populate("user", "username email")
            .populate("event", "title");
        res.status(200).json({
            success: true,
            attendees: bookings
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};