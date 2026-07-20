import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import { useParams } from "react-router-dom";
import API from "../api/api";
import "./ViewAttendees.css";


const ViewAttendees = () => {

    const { eventId } = useParams();

    const [attendees, setAttendees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    // =========================================
    // FETCH ATTENDEES
    // =========================================

    const fetchAttendees = useCallback(async () => {

        try {

            setLoading(true);

            setError("");


            const res = await API.get(
                `/dashboard/attendees/${eventId}`
            );


            setAttendees(
                res.data.attendees || []
            );

        } catch (error) {

            console.error(
                "Fetch Attendees Error:",
                error
            );


            setError(

                error.response?.data?.message ||
                "Failed to load attendees."

            );

        } finally {

            setLoading(false);

        }

    }, [eventId]);


    useEffect(() => {

        fetchAttendees();

    }, [fetchAttendees]);


    // =========================================
    // TOTAL TICKETS
    // =========================================

    const totalTickets = attendees.reduce(

        (total, booking) => {

            return total +
                Number(
                    booking.quantity || 0
                );

        },

        0

    );


    // =========================================
    // FILTER ATTENDEES
    // =========================================

    const filteredAttendees = attendees.filter(
        (booking) => {

            const username =
                booking.user?.username
                    ?.toLowerCase() || "";


            const email =
                booking.user?.email
                    ?.toLowerCase() || "";


            const searchValue =
                search.trim().toLowerCase();


            return (

                username.includes(
                    searchValue
                ) ||

                email.includes(
                    searchValue
                )

            );

        }
    );


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="attendees-loading">

                <div className="attendees-loader">
                </div>

                <h2>
                    Loading Attendees...
                </h2>

                <p>
                    Getting the attendee list for
                    your event.
                </p>

            </div>

        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div className="attendees-error">

                <div className="attendees-error-icon">
                    !
                </div>

                <h2>
                    Unable to Load Attendees
                </h2>

                <p>
                    {error}
                </p>

                <button
                    type="button"
                    onClick={fetchAttendees}
                >
                    Try Again
                </button>

            </div>

        );

    }


    return (

        <div className="attendees-page">


            {/* =========================================
                HERO
            ========================================== */}

            <section className="attendees-hero">

                <div className="attendees-hero-content">

                    <p className="attendees-label">
                        EVENT MANAGEMENT
                    </p>

                    <h1>
                        Event Attendees
                    </h1>

                    <p className="attendees-hero-description">

                        View and manage everyone who has
                        booked tickets for this event.

                    </p>

                </div>


                <div className="attendees-hero-icon">

                    👥

                </div>

            </section>


            {/* =========================================
                SUMMARY
            ========================================== */}

            <section className="attendees-summary">


                {/* TOTAL BOOKINGS */}

                <div className="attendees-summary-card">

                    <div className="attendees-summary-icon attendees-booking-icon">

                        📋

                    </div>


                    <div>

                        <p>
                            Total Bookings
                        </p>

                        <h2>
                            {attendees.length}
                        </h2>

                    </div>

                </div>


                {/* TOTAL TICKETS */}

                <div className="attendees-summary-card">

                    <div className="attendees-summary-icon attendees-ticket-icon">

                        🎟️

                    </div>


                    <div>

                        <p>
                            Total Tickets
                        </p>

                        <h2>
                            {totalTickets}
                        </h2>

                    </div>

                </div>


                {/* UNIQUE ATTENDEES */}

                <div className="attendees-summary-card">

                    <div className="attendees-summary-icon attendees-user-icon">

                        👤

                    </div>


                    <div>

                        <p>
                            Booking Accounts
                        </p>

                        <h2>
                            {attendees.length}
                        </h2>

                    </div>

                </div>


            </section>


            {/* =========================================
                ATTENDEE SECTION
            ========================================== */}

            <section className="attendees-section">


                {/* SECTION HEADER */}

                <div className="attendees-section-header">


                    <div>

                        <p className="attendees-section-label">
                            ATTENDEE LIST
                        </p>

                        <h2>
                            Registered Attendees
                        </h2>

                        <span>

                            View users who have booked
                            tickets for this event.

                        </span>

                    </div>


                    {/* SEARCH */}

                    {attendees.length > 0 && (

                        <div className="attendees-search">

                            <span>
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    )}


                </div>


                {/* =========================================
                    NO BOOKINGS
                ========================================== */}

                {attendees.length === 0 ? (

                    <div className="attendees-empty">

                        <div className="attendees-empty-icon">

                            👥

                        </div>

                        <h2>
                            No Bookings Yet
                        </h2>

                        <p>

                            No one has booked tickets for
                            this event yet. Attendees will
                            appear here once bookings are made.

                        </p>

                    </div>

                ) : filteredAttendees.length === 0 ? (


                    /* =========================================
                        NO SEARCH RESULTS
                    ========================================== */

                    <div className="attendees-empty">

                        <div className="attendees-empty-icon">

                            🔍

                        </div>

                        <h2>
                            No Attendees Found
                        </h2>

                        <p>

                            We couldn't find any attendee
                            matching "{search}".

                        </p>

                    </div>

                ) : (


                    /* =========================================
                        ATTENDEE LIST
                    ========================================== */

                    <div className="attendees-list">


                        {filteredAttendees.map(
                            (booking, index) => (

                                <div
                                    className="attendee-card"
                                    key={booking._id}
                                >


                                    {/* NUMBER */}

                                    <div className="attendee-number">

                                        {
                                            index + 1
                                        }

                                    </div>


                                    {/* AVATAR */}

                                    <div className="attendee-avatar">

                                        {
                                            booking.user
                                                ?.username
                                                ?.charAt(0)
                                                .toUpperCase() ||
                                            "U"
                                        }

                                    </div>


                                    {/* USER INFORMATION */}

                                    <div className="attendee-user-info">

                                        <h3>

                                            {
                                                booking.user
                                                    ?.username ||
                                                "Unknown User"
                                            }

                                        </h3>

                                        <p>

                                            {
                                                booking.user
                                                    ?.email ||
                                                "Email not available"
                                            }

                                        </p>

                                    </div>


                                    {/* TICKET INFORMATION */}

                                    <div className="attendee-ticket-info">

                                        <span>
                                            Tickets
                                        </span>

                                        <strong>

                                            {
                                                booking.quantity ||
                                                0
                                            }

                                        </strong>

                                    </div>


                                    {/* BOOKING STATUS */}

                                    <div className="attendee-status">

                                        <span>
                                            Booked
                                        </span>

                                    </div>


                                </div>

                            )
                        )}


                    </div>

                )}


            </section>


        </div>

    );

};


export default ViewAttendees;