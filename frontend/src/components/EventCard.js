import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
    return (
        <div style={{
            border : "1px solid #ccc",
            padding : "1.5vh",
            borderRadius : "1vh",
            marginBottom : "2vh"
        }}>
            <img 
                src={event.banner || "https://via.placeholder.com/350x180?text=Event+Banner"}
                alt={event.title}
                width="100%"
                height="180"
            />
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p><strong>Category:</strong> {event.category}</p>
            <p><strong>Date :</strong>{" "}{new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Venue :</strong>{event.venue}</p>
            <p><strong>City :</strong>{event.city}</p>
            <p><strong>Price : </strong>₹{event.ticketPrice}</p>
            <Link to={`/events/${event._id}`}>View Detials</Link>
        </div>
    )
};

export default EventCard;