import { Link } from 'react-router-dom';
import API from '../api/api';

const BookingCard = ({ booking , onCancel }) => {
    const handleCancel = async () => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking"
        )
        if (confirmCancel) return;
        try {
            const response = await API.put(`/booking/${booking._id}/cancel`)
            alert(response.data.message)
            onCancel(booking._id)
        } catch (error) {
            alert(error.response?.data?.message || "Cancellation Failed")
        }
    }

    return (
        <div style={{border: "1px solid gray",padding: "2vh", marginBottom : "2vh", borderRadius:"1vh"}}>
            <h2>{booking.event.title}</h2>
            <p><strong>Date :</strong>{' '}{new Date(booking.event.date).toLocaleDateString()}</p>
            <p><strong>Venue :</strong>{" "}{booking.event.venue}</p>
            <p><strong>Price :</strong>₹{booking.event.ticketPrice}</p>
            <p><strong>Total Amount :</strong>₹{booking.totalAmount}</p>
            <p><strong>Status :</strong>{booking.bookingStatus}</p>
            <p><strong>Payment :</strong>{" "}{booking.paymentStatus}</p>  
            {
                booking.bookingStatus === "Booked" && (
                    <button onClick={handleCancel}>
                        Cancel Booking
                    </button>
                )
            }     
            <br />     
            <br />     
            <Link to={`/ticket/${booking._id}`}><button>View Tickets</button></Link>
        </div>
    )
}

export default BookingCard