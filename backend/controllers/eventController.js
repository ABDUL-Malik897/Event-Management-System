import Event from '../models/Event.js'

export const createEvent = async (req ,res) => {
    try {
        const { title, description, category, date, time, venue, city, ticketPrice, totalSeats, banner } = req.body

        const event = await Event.create({
            title, description, category, date, time, venue, city, ticketPrice, totalSeats, banner , availableSeats : totalSeats, organizer : req.user._id
        })
        res.status(201).json({
            success : true,
            message : "Event created Successfully",
            event,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};

export const getEvents = async (req ,res) => {
    try {
        const events = await Event.find().populate("organizer", "username email").sort({ createdAt : -1 })
        res.status(200).json({
            success : true,
            count : events.length,
            events
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};

export const getEvent = async (req ,res) => {
    try {
        const event = await Event.findById(req.params.id).populate("organizer" , "username email")
        if (!event) {
            return res.status(404).json({
                success : false,
                message : "Event Not Found"
            })
        }
        res.status(200).json({
            success : true,
            event
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};

export const updateEvent = async (req ,res) => {
    try {
        const event = await Event.findById(req.params.id)
        if (!event) {
            return res.status(404).json({
                success : false,
                message : "Event Not Found"
            })
        }
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success : false,
                message : "Not Authorized"
            })
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body , { new : true , runValidators : true})

        res.status(200).json({
            success : true,
            message : "Event updated Successfully",
            event : updateEvent,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};

export const deleteEvent = async (req ,res) => {
    try {
        const event = await Event.findById(req.params.id)
        if (!event) {
            return res.status(404).json({
                success : false,
                message : "Event Not Found"
            })
        }
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success : false,
                message : "Not Authorized"
            })
        }

        await event.deleteOne()

        res.status(200).json({
            success : true,
            message : "Event Deleted Successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Server Error"
        })
    }
};