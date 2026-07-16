import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import API from '../api/api';

const EventDetails = () => {

    const { id } = useParams()
    const [event ,setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [bookingLoading , setBookingLoading] = useState(false)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await API.get(`/events/${id}`)
                setEvent(response.data.event)
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        }
        fetchEvent()
    },[id])

    if (loading) {
        return <h2>Loading.....</h2>
    }

    const handleBooking = async () => {
        try {
            setBookingLoading(true)
            const response = await API.post("/booking",{
                eventId : event._id,
                quantity
            })
            alert(response.data.message)
            setEvent((prev) => ({
                ...prev, availableSeats : response.data.availableSeats
            }))
        } catch (error) {
            alert(error.response?.data?.message || "Booking Failed")
        } finally {
            setBookingLoading(false)
        }
    }

    return (
        <>
            <div style={{ width:"70%",margin:"4vh auto"}}>
                <img 
                    src={event.banner || "https://via.placeholder.com/350x180?text=Event+Banner"}
                    alt={event.title}
                    width="100%"
                    height="350"
                />
                <h1>{event.title}</h1>
                <p>{event.description}</p>
                <hr/>
                <p><strong>Category :</strong>{event.category}</p>
                <p><strong>Date :</strong>{' '}{new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Time :</strong>{event.time}</p>
                <p><strong>Venue :</strong>{event.venue}</p>
                <p><strong>City :</strong>{event.city}</p>
                <p><strong>Ticket Price :</strong>₹{event.ticketPrice}</p>
                <p><strong>Available Seats :</strong>{event.availableSeats}</p>
                <p><strong>Organizer :</strong>{" "}{event.organizer?.username}</p>
                <br />
            </div>
            <div style={{ marginTop: "2vh" }}>
                <label>Number of Tickets</label>
                <br />
                <input
                    type="number"
                    min="1"
                    max={event.availableSeats}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
            </div>
            <button
                    onClick={handleBooking}
                    disabled={bookingLoading || event.availableSeats === 0}
                    >{
                        bookingLoading ? "Booking..." : event.availableSeats === 0 ? "Sold Out" : "Book Ticket" 
                    }
                </button>
        </>
    )
}

export default EventDetails