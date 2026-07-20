import React, { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";
import BookingCard from "../components/BookingCard";
import "./MyBooking.css";

const MyBooking = () => {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);


    // =========================
    // FETCH USER BOOKINGS
    // =========================

    const fetchBookings = async () => {

        try {

            const response = await API.get("/booking/my");

            setBookings(
                response.data.bookings || []
            );

        } catch (error) {

            console.error(
                "Error fetching bookings:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to load your bookings"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchBookings();

    }, []);


    // =========================
    // UPDATE CANCELLED BOOKING
    // =========================

    const removeBooking = (id) => {

        setBookings((prev) =>

            prev.map((booking) =>

                booking._id === id

                    ? {
                        ...booking,
                        bookingStatus: "Cancelled"
                    }

                    : booking

            )

        );

    };


    // =========================
    // BOOKING COUNTS
    // =========================

    const activeBookings = bookings.filter(
        (booking) =>
            booking.bookingStatus === "Booked"
    ).length;


    const cancelledBookings = bookings.filter(
        (booking) =>
            booking.bookingStatus === "Cancelled"
    ).length;


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="my-bookings-loading">

                <div className="my-bookings-loader"></div>

                <h2>
                    Loading your bookings...
                </h2>

                <p>
                    We're getting your event tickets ready.
                </p>

            </div>

        );

    }


    return (

        <div className="my-bookings-page">


            {/* =========================
                HERO
            ========================== */}

            <section className="my-bookings-hero">

                <div className="my-bookings-hero-content">

                    <p className="my-bookings-hero-label">
                        YOUR EVENTS • YOUR TICKETS
                    </p>

                    <h1>
                        My Bookings
                    </h1>

                    <p>

                        Manage your event bookings,
                        view your digital tickets and
                        keep track of your upcoming
                        experiences.

                    </p>

                </div>


                <div className="my-bookings-hero-icon">

                    🎟️

                </div>

            </section>


            {/* =========================
                MAIN CONTENT
            ========================== */}

            <section className="my-bookings-section">


                {/* HEADER */}

                <div className="my-bookings-header">

                    <div>

                        <p className="my-bookings-label">
                            BOOKING HISTORY
                        </p>

                        <h2>
                            Your Event Bookings
                        </h2>

                        <p>

                            View and manage all the events
                            you've booked through EventHub.

                        </p>

                    </div>

                </div>


                {/* =========================
                    BOOKING STATS
                ========================== */}

                {bookings.length > 0 && (

                    <div className="my-bookings-stats">


                        {/* TOTAL */}

                        <div className="booking-stat-card">

                            <div className="booking-stat-icon">
                                🎫
                            </div>

                            <div>

                                <span>
                                    Total Bookings
                                </span>

                                <strong>
                                    {bookings.length}
                                </strong>

                            </div>

                        </div>


                        {/* ACTIVE */}

                        <div className="booking-stat-card booking-stat-active">

                            <div className="booking-stat-icon">
                                ✓
                            </div>

                            <div>

                                <span>
                                    Active
                                </span>

                                <strong>
                                    {activeBookings}
                                </strong>

                            </div>

                        </div>


                        {/* CANCELLED */}

                        <div className="booking-stat-card booking-stat-cancelled">

                            <div className="booking-stat-icon">
                                ✕
                            </div>

                            <div>

                                <span>
                                    Cancelled
                                </span>

                                <strong>
                                    {cancelledBookings}
                                </strong>

                            </div>

                        </div>

                    </div>

                )}


                {/* =========================
                    BOOKINGS
                ========================== */}

                {
                    bookings.length === 0 ? (

                        <div className="my-bookings-empty">

                            <div className="my-bookings-empty-icon">

                                🎟️

                            </div>

                            <h2>
                                No Bookings Yet
                            </h2>

                            <p>

                                You haven't booked any events yet.
                                Explore exciting events and start
                                creating unforgettable experiences.

                            </p>

                        </div>

                    ) : (

                        <div className="my-bookings-list">

                            {
                                bookings.map((booking) => (

                                    <div
                                        className="my-booking-item"
                                        key={booking._id}
                                    >

                                        <BookingCard
                                            booking={booking}
                                            onCancel={removeBooking}
                                        />

                                    </div>

                                ))
                            }

                        </div>

                    )
                }

            </section>

        </div>

    );

};

export default MyBooking;