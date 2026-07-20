import { Link } from "react-router-dom";
import "./EventCard.css";

const EventCard = ({ event }) => {

    return (

        <div className="event-card">

            {/* EVENT IMAGE */}

            <div className="event-card-image">

                <img
                    src={
                        event.banner ||
                        "https://via.placeholder.com/350x180?text=Event+Banner"
                    }
                    alt={event.title || "Event"}
                />

                {event.category && (
                    <span className="event-card-category">
                        {event.category}
                    </span>
                )}

            </div>


            {/* EVENT CONTENT */}

            <div className="event-card-content">

                <h2 className="event-card-title">
                    {event.title || "Untitled Event"}
                </h2>

                <p className="event-card-description">
                    {event.description || "No description available."}
                </p>


                {/* EVENT INFORMATION */}

                <div className="event-card-info">

                    <div className="event-info-item">

                        <span className="event-info-icon">
                            📅
                        </span>

                        <div>

                            <small>
                                Date
                            </small>

                            <p>
                                {
                                    event.date
                                        ? new Date(
                                            event.date
                                        ).toLocaleDateString()
                                        : "Date not available"
                                }
                            </p>

                        </div>

                    </div>


                    <div className="event-info-item">

                        <span className="event-info-icon">
                            📍
                        </span>

                        <div>

                            <small>
                                Location
                            </small>

                            <p>
                                {
                                    [event.venue, event.city]
                                        .filter(Boolean)
                                        .join(", ") ||
                                    "Location not available"
                                }
                            </p>

                        </div>

                    </div>

                </div>


                {/* EVENT FOOTER */}

                <div className="event-card-footer">

                    <div className="event-card-price">

                        <small>
                            Starting from
                        </small>

                        <strong>
                            {
                                Number(event.ticketPrice) === 0
                                    ? "Free"
                                    : `₹${event.ticketPrice ?? 0}`
                            }
                        </strong>

                    </div>


                    <Link
                        to={`/events/${event._id}`}
                        className="event-details-link"
                    >
                        View Details →
                    </Link>

                </div>

            </div>

        </div>

    );

};

export default EventCard;