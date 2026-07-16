import React, { useEffect, useState } from 'react'
import API from '../api/api'
import BookingCard from '../components/BookingCard'

const MyBooking = () => {

    const [bookings ,setBookings] = useState([])
    const [loading ,setLoading] = useState(true)

    useEffect(() => {
        fetchBookings()
    },[])
    const fetchBookings = async () => {
        try {
            const response = await API.get("/booking/my")
            setBookings(response.data.bookings)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const removeBooking = (id) => {
        setBookings((prev) =>
            prev.map((booking) => booking._id === id ? {
                ...booking,bookingStatus : "Cancelled"
            } : booking)
        )
    }

    if (loading) {
        return <h2>Loading...</h2>
    }

    return (
        <div style={{ width:"80%", margin:"3vh auto" }}>
            <h1>My Bookings</h1>
            {
                bookings.length === 0
                    ? (
                        <h2>No Booking Found</h2>
                    ) : (
                        bookings.map((booking) => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                onCancel={removeBooking}/>
                        ))
                    )
            }
        </div>
    )
}

export default MyBooking