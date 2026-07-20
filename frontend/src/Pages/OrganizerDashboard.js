import React, { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import "./OrganizerDashboard.css";

const OrganizerDashboard = () => {

    const [stats, setStats] = useState({
        totalEvents: 0,
        ticketsSold: 0,
        revenue: 0,
        upcomingEvents: 0
    });

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();


    // =========================================
    // FETCH DASHBOARD DATA
    // =========================================

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const statsRes = await API.get("/dashboard");

                setStats(
                        statsRes.data.stats || {
                            totalEvents: 0,
                            ticketsSold: 0,
                            revenue: 0,
                            upcomingEvents: 0
                        }
                    );


                const eventsRes = await API.get(
                    "/dashboard/events"
                );

                setEvents(eventsRes.data.events || []);

            } catch (error) {

                console.error(
                    "Dashboard Error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load organizer dashboard"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchDashboard();

    }, []);


    // =========================================
    // DELETE EVENT
    // =========================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await API.delete(`/events/${id}`);


            setEvents((prevEvents) =>
                prevEvents.filter(
                    (event) => event._id !== id
                )
            );


            setStats((prevStats) => ({
                ...prevStats,
                totalEvents:
                    Math.max(
                        prevStats.totalEvents - 1,
                        0
                    )
            }));


            toast.success(
                "Event deleted successfully"
            );

        } catch (error) {

            console.error(
                "Delete Event Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to delete event"
            );

        }

    };


    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {

        if (!date) {
            return "Date not available";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="organizer-dashboard-loading">

                <div className="organizer-dashboard-loader">
                </div>

                <h2>
                    Loading Dashboard...
                </h2>

                <p>
                    Getting your events and performance data.
                </p>

            </div>

        );

    }


    return (

        <div className="organizer-dashboard-page">


            {/* =========================================
                HERO / HEADER
            ========================================== */}

            <section className="organizer-dashboard-header">

                <div>

                    <p className="organizer-dashboard-label">
                        ORGANIZER DASHBOARD
                    </p>

                    <h1>
                        Manage Your Events
                    </h1>

                    <p className="organizer-dashboard-description">

                        Track your events, monitor ticket sales,
                        manage attendees and stay on top of your
                        event performance.

                    </p>

                </div>


                <Link
                    to="/create-event"
                    className="organizer-dashboard-create-btn"
                >

                    <span className="organizer-dashboard-plus">
                        +
                    </span>

                    Create Event

                </Link>

            </section>


            {/* =========================================
                STATS
            ========================================== */}

            <section className="organizer-dashboard-stats">


                {/* TOTAL EVENTS */}

                <div className="organizer-stat-card">

                    <div className="organizer-stat-top">

                        <div className="organizer-stat-icon stat-events">
                            📅
                        </div>

                        <span className="organizer-stat-badge">
                            Events
                        </span>

                    </div>


                    <div className="organizer-stat-content">

                        <p>
                            Total Events
                        </p>

                        <h2>
                            {stats.totalEvents}
                        </h2>

                    </div>

                </div>


                {/* TICKETS SOLD */}

                <div className="organizer-stat-card">

                    <div className="organizer-stat-top">

                        <div className="organizer-stat-icon stat-tickets">
                            🎟️
                        </div>

                        <span className="organizer-stat-badge">
                            Tickets
                        </span>

                    </div>


                    <div className="organizer-stat-content">

                        <p>
                            Tickets Sold
                        </p>

                        <h2>
                            {stats.ticketsSold}
                        </h2>

                    </div>

                </div>


                {/* REVENUE */}

                <div className="organizer-stat-card">

                    <div className="organizer-stat-top">

                        <div className="organizer-stat-icon stat-revenue">
                            ₹
                        </div>

                        <span className="organizer-stat-badge">
                            Revenue
                        </span>

                    </div>


                    <div className="organizer-stat-content">

                        <p>
                            Total Revenue
                        </p>

                        <h2>
                            ₹{Number(
                                stats.revenue || 0
                            ).toLocaleString("en-IN")}
                        </h2>

                    </div>

                </div>


                {/* UPCOMING EVENTS */}

                <div className="organizer-stat-card">

                    <div className="organizer-stat-top">

                        <div className="organizer-stat-icon stat-upcoming">
                            🚀
                        </div>

                        <span className="organizer-stat-badge">
                            Upcoming
                        </span>

                    </div>


                    <div className="organizer-stat-content">

                        <p>
                            Upcoming Events
                        </p>

                        <h2>
                            {stats.upcomingEvents}
                        </h2>

                    </div>

                </div>


            </section>


            {/* =========================================
                QUICK ACTIONS
            ========================================== */}

            <section className="organizer-dashboard-actions">

                <div>

                    <p className="organizer-dashboard-section-label">
                        QUICK ACTIONS
                    </p>

                    <h2>
                        Organizer Tools
                    </h2>

                </div>


                <div className="organizer-dashboard-action-buttons">

                    <Link
                        to="/create-event"
                        className="dashboard-action-btn"
                    >
                        <span>＋</span>
                        Create Event
                    </Link>


                    <Link
                        to="/analytics"
                        className="dashboard-action-btn"
                    >
                        <span>📈</span>
                        Analytics
                    </Link>


                    <Link
                        to="/scanner"
                        className="dashboard-action-btn"
                    >
                        <span>▣</span>
                        QR Scanner
                    </Link>

                </div>

            </section>


            {/* =========================================
                MY EVENTS
            ========================================== */}

            <section className="organizer-events-section">


                {/* SECTION HEADER */}

                <div className="organizer-events-header">

                    <div>

                        <p className="organizer-dashboard-section-label">
                            EVENT MANAGEMENT
                        </p>

                        <h2>
                            My Events
                        </h2>

                        <p>

                            Manage and monitor all the events
                            you've created.

                        </p>

                    </div>


                    <div className="organizer-events-count">

                        <strong>
                            {events.length}
                        </strong>

                        <span>
                            {
                                events.length === 1
                                    ? "Event"
                                    : "Events"
                            }
                        </span>

                    </div>

                </div>


                {/* =========================================
                    NO EVENTS
                ========================================== */}

                {events.length === 0 ? (

                    <div className="organizer-no-events">

                        <div className="organizer-no-events-icon">
                            📅
                        </div>

                        <h2>
                            No Events Yet
                        </h2>

                        <p>

                            You haven't created any events yet.
                            Start by creating your first event
                            and bring your idea to life.

                        </p>


                        <Link
                            to="/create-event"
                            className="organizer-no-events-btn"
                        >
                            Create Your First Event
                        </Link>

                    </div>

                ) : (

                    /* =========================================
                        EVENTS GRID
                    ========================================== */

                    <div className="organizer-events-grid">

                        {events.map((event) => (

                            <article
                                key={event._id}
                                className="organizer-event-card"
                            >


                                {/* EVENT BANNER */}

                                <div className="organizer-event-banner">

                                    {event.banner ? (

                                        <img
                                            src={event.banner}
                                            alt={event.title}
                                        />

                                    ) : (

                                        <div className="organizer-event-placeholder">

                                            <span>
                                                🎉
                                            </span>

                                        </div>

                                    )}


                                    <div className="organizer-event-category">

                                        {
                                            event.category ||
                                            "Event"
                                        }

                                    </div>

                                </div>


                                {/* EVENT CONTENT */}

                                <div className="organizer-event-content">


                                    <div className="organizer-event-main-info">

                                        <h3>
                                            {event.title}
                                        </h3>


                                        <div className="organizer-event-info">

                                            <p>

                                                <span>
                                                    📅
                                                </span>

                                                {
                                                    formatDate(
                                                        event.date
                                                    )
                                                }

                                            </p>


                                            <p>

                                                <span>
                                                    📍
                                                </span>

                                                {
                                                    event.venue ||
                                                    event.location ||
                                                    "Location not available"
                                                }

                                            </p>


                                            {event.city && (

                                                <p>

                                                    <span>
                                                        🏙️
                                                    </span>

                                                    {event.city}

                                                </p>

                                            )}

                                        </div>

                                    </div>


                                    {/* EVENT DETAILS */}

                                    <div className="organizer-event-mini-stats">


                                        <div>

                                            <span>
                                                Price
                                            </span>

                                            <strong>
                                                ₹{
                                                    event.ticketPrice ||
                                                    0
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Available
                                            </span>

                                            <strong>
                                                {
                                                    event.availableSeats ??
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Capacity
                                            </span>

                                            <strong>
                                                {
                                                    event.totalSeats ??
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                    </div>


                                    {/* =========================================
                                        PRIMARY ACTIONS
                                    ========================================== */}

                                    <div className="organizer-event-primary-actions">


                                        <button
                                            className="organizer-event-btn event-edit-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/edit-event/${event._id}`
                                                )
                                            }
                                        >
                                            Edit Event
                                        </button>


                                        <button
                                            className="organizer-event-btn event-attendees-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/attendees/${event._id}`
                                                )
                                            }
                                        >
                                            View Attendees
                                        </button>


                                    </div>


                                    {/* =========================================
                                        SECONDARY ACTIONS
                                    ========================================== */}

                                    <div className="organizer-event-secondary-actions">


                                        <Link
                                            to={`/attendance/${event._id}`}
                                            className="organizer-event-small-btn"
                                        >
                                            Attendance
                                        </Link>


                                        <button
                                            className="organizer-event-small-btn"
                                            onClick={() =>
                                                navigate(
                                                    "/analytics"
                                                )
                                            }
                                        >
                                            Analytics
                                        </button>


                                        <button
                                            className="organizer-event-delete-btn"
                                            onClick={() =>
                                                handleDelete(
                                                    event._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>


                                    </div>


                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>


        </div>

    );

};

export default OrganizerDashboard;