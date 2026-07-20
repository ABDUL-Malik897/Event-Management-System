import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthContext from "../hooks/useAuthContext";
import API from "../api/api";
import "./Home.css";

const Home = () => {

    const { user } = useAuthContext();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    useEffect(() => {

        if (!user) return;

        const fetchEvents = async () => {

            try {

                const response = await API.get("/events");

                // Show only first 3 events
                setEvents(response.data.events?.slice(0, 3) || []);

            } catch (error) {

                console.error(
                    "Failed to fetch featured events:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load featured events"
                );

            } finally {

                setLoadingEvents(false);

            }

        };

        fetchEvents();

    }, [user]);


    const handleCategory = (category) => {

        navigate(
            `/events?category=${encodeURIComponent(category)}`
        );

    };

    if (!user) {
        return null;
    }


    return (

        <div className="home-container">


            {/* ========================== */}
            {/* WELCOME HERO */}
            {/* ========================== */}

            <section className="home-welcome">

                <div className="home-welcome-content">

                    <p className="home-welcome-label">
                        WELCOME TO EVENTHUB
                    </p>

                    <h1>
                        Welcome back, {user.username} 👋
                    </h1>

                    <p>
                        Find something worth showing up for.
                        Discover concerts, workshops, conferences,
                        festivals and unforgettable experiences.
                    </p>

                    <Link
                        to="/events"
                        className="home-primary-btn"
                    >
                        Explore Events
                    </Link>

                </div>

            </section>


            {/* ========================== */}
            {/* FEATURED EVENTS */}
            {/* ========================== */}

            <section className="home-section">

                <div className="home-section-header">

                    <div>

                        <p className="home-section-label">
                            DISCOVER
                        </p>

                        <h2>Featured Events</h2>

                        <p>
                            Explore some of the latest events
                            available on EventHub.
                        </p>

                    </div>


                    <Link
                        to="/events"
                        className="home-view-all"
                    >
                        View All Events →
                    </Link>

                </div>


                {loadingEvents ? (

                    <p>Loading events...</p>

                ) : events.length === 0 ? (

                    <div className="home-empty-events">

                        <h3>No events available right now</h3>

                        <p>
                            Check back later for upcoming events.
                        </p>

                    </div>

                ) : (

                    <div className="featured-events-grid">

                        {events.map((event) => (

                            <div
                                className="featured-event-card"
                                key={event._id}
                            >

                                <div className="featured-event-image">

                                    <img
                                        src={
                                            event.banner ||
                                            "https://via.placeholder.com/400x220"
                                        }
                                        alt={event.title}
                                    />

                                    <span className="event-category">
                                        {event.category}
                                    </span>

                                </div>


                                <div className="featured-event-content">

                                    <h3>{event.title}</h3>

                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(
                                            event.date
                                        ).toLocaleDateString()}
                                    </p>

                                    <p>
                                        <strong>Venue:</strong>{" "}
                                        {event.venue}
                                    </p>

                                    <p>
                                        <strong>City:</strong>{" "}
                                        {event.city}
                                    </p>


                                    <div className="featured-event-footer">

                                        <span className="event-price">
                                            ₹{event.ticketPrice}
                                        </span>


                                        <Link
                                            to={`/events/${event._id}`}
                                            className="event-view-btn"
                                        >
                                            View Event
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>


            {/* ========================== */}
            {/* CATEGORIES */}
            {/* ========================== */}

            <section className="home-section">

                <div className="home-section-title">

                    <p className="home-section-label">
                        EXPLORE
                    </p>

                    <h2>Browse by Category</h2>

                    <p>
                        Find events based on what interests you.
                    </p>

                </div>


                <div className="category-grid">

                    <button
                        className="category-card"
                        onClick={() =>
                            handleCategory("Music")
                        }
                    >
                        <span>🎵</span>
                        <h3>Music</h3>
                    </button>


                    <button
                        className="category-card"
                        onClick={() =>
                            handleCategory("Sports")
                        }
                    >
                        <span>⚽</span>
                        <h3>Sports</h3>
                    </button>


                    <button
                        className="category-card"
                        onClick={() =>
                            handleCategory("Workshop")
                        }
                    >
                        <span>💻</span>
                        <h3>Workshops</h3>
                    </button>


                    <button
                        className="category-card"
                        onClick={() =>
                            handleCategory("Conference")
                        }
                    >
                        <span>🎤</span>
                        <h3>Conferences</h3>
                    </button>


                    <button
                        className="category-card"
                        onClick={() =>
                            handleCategory("Festival")
                        }
                    >
                        <span>🎉</span>
                        <h3>Festivals</h3>
                    </button>


                    <button
                        className="category-card"
                        onClick={() =>
                            handleCategory("College")
                        }
                    >
                        <span>🎓</span>
                        <h3>College</h3>
                    </button>

                </div>

            </section>


            {/* ========================== */}
            {/* YOUR EVENTHUB */}
            {/* ========================== */}

            <section className="home-section">

                <div className="home-section-title">

                    <p className="home-section-label">
                        YOUR ACCOUNT
                    </p>

                    <h2>Your EventHub</h2>

                    <p>
                        Everything related to your events and
                        bookings in one place.
                    </p>

                </div>


                <div className="home-grid">


                    <Link
                        to="/events"
                        className="home-card-link"
                    >

                        <div className="home-card">

                            <h3>Explore Events</h3>

                            <p>
                                Find upcoming events and discover
                                your next experience.
                            </p>

                            <span>Explore →</span>

                        </div>

                    </Link>


                    <Link
                        to="/my-booking"
                        className="home-card-link"
                    >

                        <div className="home-card">

                            <h3>My Bookings</h3>

                            <p>
                                View your booked events and
                                access your tickets.
                            </p>

                            <span>View Bookings →</span>

                        </div>

                    </Link>


                    <Link
                        to="/payment-history"
                        className="home-card-link"
                    >

                        <div className="home-card">

                            <h3>Payment History</h3>

                            <p>
                                Review your payments and
                                transaction history.
                            </p>

                            <span>View Payments →</span>

                        </div>

                    </Link>


                    {user.role === "user" && (

                        <Link
                            to="/become-organizer"
                            className="home-card-link"
                        >

                            <div className="home-card">

                                <h3>Become an Organizer</h3>

                                <p>
                                    Start creating events and
                                    bring your ideas to life.
                                </p>

                                <span>Apply Now →</span>

                            </div>

                        </Link>

                    )}


                </div>

            </section>


            {/* ========================== */}
            {/* WHY EVENTHUB */}
            {/* ========================== */}

            <section className="why-eventhub">

                <div className="home-section-title">

                    <p className="home-section-label">
                        WHY EVENTHUB
                    </p>

                    <h2>
                        Everything you need, in one place.
                    </h2>

                    <p>
                        From discovering events to entering the
                        venue, EventHub makes your entire event
                        experience simple.
                    </p>

                </div>


                <div className="why-grid">


                    <div className="why-card">

                        <div className="why-icon">
                            🔒
                        </div>

                        <h3>Secure Payments</h3>

                        <p>
                            Book your tickets confidently with
                            secure online payment processing.
                        </p>

                    </div>


                    <div className="why-card">

                        <div className="why-icon">
                            🎟️
                        </div>

                        <h3>Instant QR Tickets</h3>

                        <p>
                            Receive your unique digital QR ticket
                            immediately after successful booking.
                        </p>

                    </div>


                    <div className="why-card">

                        <div className="why-icon">
                            ⚡
                        </div>

                        <h3>Easy Event Access</h3>

                        <p>
                            No paper tickets required. Simply show
                            your QR code for quick event check-in.
                        </p>

                    </div>


                </div>

            </section>


            {/* ========================== */}
            {/* NORMAL USER ORGANIZER CTA */}
            {/* ========================== */}

            {user.role === "user" && (

                <section className="organizer-cta">

                    <div>

                        <p className="home-section-label">
                            FOR CREATORS
                        </p>

                        <h2>
                            Have an event idea?
                        </h2>

                        <p>
                            Turn your idea into an experience.
                            Become an EventHub organizer and start
                            creating events for your audience.
                        </p>

                    </div>


                    <Link
                        to="/become-organizer"
                        className="home-primary-btn"
                    >
                        Become an Organizer
                    </Link>

                </section>

            )}


            {/* ========================== */}
            {/* ORGANIZER TOOLS */}
            {/* ========================== */}

            {user.role === "organizer" && (

                <section className="home-section">

                    <div className="home-section-title">

                        <p className="home-section-label">
                            ORGANIZER
                        </p>

                        <h2>Manage Your Events</h2>

                        <p>
                            Create events, track performance and
                            manage your attendees.
                        </p>

                    </div>


                    <div className="home-grid">


                        <Link
                            to="/organizer-dashboard"
                            className="home-card-link"
                        >

                            <div className="home-card">

                                <h3>Organizer Dashboard</h3>

                                <p>
                                    Manage all your events from
                                    one dashboard.
                                </p>

                                <span>Open Dashboard →</span>

                            </div>

                        </Link>


                        <Link
                            to="/create-event"
                            className="home-card-link"
                        >

                            <div className="home-card">

                                <h3>Create Event</h3>

                                <p>
                                    Create and publish your next
                                    event.
                                </p>

                                <span>Create Event →</span>

                            </div>

                        </Link>


                        <Link
                            to="/analytics"
                            className="home-card-link"
                        >

                            <div className="home-card">

                                <h3>Analytics</h3>

                                <p>
                                    Track ticket sales and event
                                    performance.
                                </p>

                                <span>View Analytics →</span>

                            </div>

                        </Link>


                        <Link
                            to="/scanner"
                            className="home-card-link"
                        >

                            <div className="home-card">

                                <h3>QR Scanner</h3>

                                <p>
                                    Scan attendee tickets and
                                    manage event check-ins.
                                </p>

                                <span>Open Scanner →</span>

                            </div>

                        </Link>


                    </div>

                </section>

            )}


            {/* ========================== */}
            {/* FINAL CTA */}
            {/* ========================== */}

            <section className="home-final-cta">

                <h2>
                    Your next experience is waiting.
                </h2>

                <p>
                    Discover concerts, workshops, conferences,
                    festivals and more on EventHub.
                </p>

                <Link
                    to="/events"
                    className="home-primary-btn"
                >
                    Explore All Events
                </Link>

            </section>


        </div>

    );

};

export default Home;