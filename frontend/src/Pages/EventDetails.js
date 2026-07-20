import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/api";
import "./EventDetails.css";

const EventDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [event, setEvent] = useState(null);

    const [loading, setLoading] = useState(true);

    const [quantity, setQuantity] = useState(1);

    const [paymentLoading, setPaymentLoading] = useState(false);


    // =========================================
    // FETCH EVENT
    // =========================================

    useEffect(() => {

        const fetchEvent = async () => {

            try {

                const response = await API.get(
                    `/events/${id}`
                );

                setEvent(response.data.event);

            } catch (error) {

                console.error(
                    "Fetch Event Error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load event details"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchEvent();

    }, [id]);

    // =========================================
    // LOAD RAZORPAY
    // =========================================

    const loadRazorpayScript = () => {

        return new Promise((resolve) => {

            // Prevent loading the script again
            if (window.Razorpay) {

                resolve(true);

                return;

            }


            const script =
                document.createElement("script");


            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";


            script.onload = () => {

                resolve(true);

            };


            script.onerror = () => {

                resolve(false);

            };


            document.body.appendChild(script);

        });

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="event-details-loading">

                <div className="event-details-loader">
                </div>

                <h2>
                    Loading Event...
                </h2>

                <p>
                    Getting event information.
                </p>

            </div>

        );

    }


    // =========================================
    // EVENT NOT FOUND
    // =========================================

    if (!event) {

        return (

            <div className="event-details-not-found">

                <div>
                    🎫
                </div>

                <h2>
                    Event Not Found
                </h2>

                <p>
                    The event you're looking for
                    could not be found.
                </p>

                <button
                    onClick={() =>
                        navigate("/events")
                    }
                >
                    Browse Events
                </button>

            </div>

        );

    }


    // =========================================
    // PAYMENT
    // =========================================

    const handlePayment = async () => {

        if (
            quantity < 1 ||
            quantity > event.availableSeats
        ) {

            toast.error(
                "Please select a valid number of tickets."
            );

            return;

        }


        try {

            setPaymentLoading(true);


            // =================================
            // LOAD RAZORPAY SCRIPT
            // =================================

            const loaded =
                await loadRazorpayScript();


            if (!loaded) {

                toast.error(
                    "Razorpay SDK failed to load."
                );

                setPaymentLoading(false);

                return;

            }


            // =================================
            // CREATE PAYMENT ORDER
            // =================================

            const response =
                await API.post(
                    "/payment/create-order",
                    {
                        eventId: event._id,

                        quantity: quantity
                    }
                );


            const {
                order,
                key
            } = response.data;


            // =================================
            // RAZORPAY OPTIONS
            // =================================

            const options = {

                key: key,

                amount: order.amount,

                currency: order.currency,

                name: "EventHub",

                description:
                    `Booking for ${event.title}`,

                order_id: order.id,


                // =================================
                // PAYMENT SUCCESS
                // =================================

                handler: async function (
                    response
                ) {

                    try {

                        const verifyResponse =
                            await API.post(
                                "/payment/verify",
                                {

                                    razorpay_order_id:
                                        response
                                            .razorpay_order_id,

                                    razorpay_payment_id:
                                        response
                                            .razorpay_payment_id,

                                    razorpay_signature:
                                        response
                                            .razorpay_signature,

                                    eventId:
                                        event._id,

                                    quantity:
                                        quantity

                                }
                            );


                        if (
                            verifyResponse
                                .data
                                .success
                        ) {

                            toast.success(
                                "Payment Successful! Your tickets have been booked."
                            );


                            navigate(
                                "/my-booking"
                            );

                        }


                    } catch (error) {

                        console.error(
                            "Payment Verification Error:",
                            error
                        );


                        toast.error(

                            error.response
                                ?.data
                                ?.message ||

                            "Booking creation failed"

                        );

                    } finally {

                        setPaymentLoading(false);

                    }

                },


                // =================================
                // PAYMENT MODAL CLOSED
                // =================================

                modal: {

                    ondismiss: function () {

                        console.error(
                            "Razorpay checkout closed"
                        );


                        setPaymentLoading(false);


                        toast(
                            "Payment was not completed. You can try again."
                        );

                    }

                },


                // =================================
                // PREFILL
                // =================================

                prefill: {

                    name: "",

                    email: "",

                    contact: ""

                },


                theme: {

                    color: "#6c5ce7"

                }

            };


            // =================================
            // OPEN RAZORPAY
            // =================================

            const paymentObject =
                new window.Razorpay(
                    options
                );


            // =================================
            // PAYMENT FAILED
            // =================================

            paymentObject.on(

                "payment.failed",

                async function (response) {

                    try {

                        console.error(
                            "Payment Failed:",
                            response.error
                        );


                        await API.post(
                            "/payment/failed",
                            {

                                razorpay_order_id:

                                    response.error
                                        .metadata
                                        ?.order_id ||

                                    order.id,


                                razorpay_payment_id:

                                    response.error
                                        .metadata
                                        ?.payment_id ||

                                    null,


                                failureReason:

                                    response.error
                                        .description ||

                                    "Payment failed"

                            }
                        );


                    } catch (error) {

                        console.error(
                            "Failed to record payment failure:",
                            error
                        );

                    }


                    setPaymentLoading(false);


                    toast.error(

                        response.error
                            .description ||

                        "Payment Failed. Please try again."

                    );

                }

            );


            paymentObject.open();


        } catch (error) {

            console.error(
                "Payment Error:",
                error.response?.data ||
                error
            );


            toast.error(

                error.response
                    ?.data
                    ?.message ||

                "Unable to start payment"

            );


            setPaymentLoading(false);

        }

    };


    // =========================================
    // TOTAL PRICE
    // =========================================

    const totalPrice =

        Number(event.ticketPrice) *

        quantity;


    return (

        <div className="event-details-page">


            {/* =========================================
                EVENT BANNER
            ========================================== */}

            <section className="event-details-banner">


                <img

                    src={
                        event.banner ||
                        "https://via.placeholder.com/1200x500?text=Event+Banner"
                    }

                    alt={event.title}

                />


                <div className="event-banner-overlay">


                    <span className="event-category-badge">

                        {event.category}

                    </span>


                    <h1>

                        {event.title}

                    </h1>


                    <p>

                        📍 {event.venue}, {event.city}

                    </p>


                </div>


            </section>


            {/* =========================================
                MAIN CONTENT
            ========================================== */}

            <div className="event-details-layout">


                {/* =====================================
                    EVENT INFORMATION
                ====================================== */}

                <main className="event-info-section">


                    <div className="event-info-header">


                        <p>

                            EVENT INFORMATION

                        </p>


                        <h2>

                            About This Event

                        </h2>


                    </div>


                    <p className="event-description">

                        {event.description}

                    </p>


                    {/* =================================
                        EVENT INFO GRID
                    ================================== */}

                    <div className="event-info-grid">


                        <div className="event-info-card">


                            <div className="event-info-icon">

                                📅

                            </div>


                            <div>

                                <span>

                                    Date

                                </span>


                                <strong>

                                    {
                                        new Date(
                                            event.date
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "numeric",

                                                month: "long",

                                                year: "numeric"
                                            }
                                        )
                                    }

                                </strong>

                            </div>


                        </div>


                        <div className="event-info-card">


                            <div className="event-info-icon">

                                🕒

                            </div>


                            <div>

                                <span>

                                    Time

                                </span>


                                <strong>

                                    {
                                        event.time ||
                                        "Not specified"
                                    }

                                </strong>

                            </div>


                        </div>


                        <div className="event-info-card">


                            <div className="event-info-icon">

                                📍

                            </div>


                            <div>

                                <span>

                                    Venue

                                </span>


                                <strong>

                                    {event.venue}

                                </strong>


                                <small>

                                    {event.city}

                                </small>

                            </div>


                        </div>


                        <div className="event-info-card">


                            <div className="event-info-icon">

                                👤

                            </div>


                            <div>

                                <span>

                                    Organizer

                                </span>


                                <strong>

                                    {
                                        event.organizer
                                            ?.username ||
                                        "Event Organizer"
                                    }

                                </strong>

                            </div>


                        </div>


                    </div>


                    {/* =================================
                        TICKET AVAILABILITY
                    ================================== */}

                    <div className="event-availability">


                        <div className="event-availability-icon">

                            🎟️

                        </div>


                        <div>


                            <span>

                                Ticket Availability

                            </span>


                            <h3>

                                {
                                    event.availableSeats
                                }{" "}

                                Seats Available

                            </h3>


                            <p>

                                Book your tickets before
                                they're sold out.

                            </p>


                        </div>


                    </div>


                </main>


                {/* =====================================
                    BOOKING CARD
                ====================================== */}

                <aside className="event-booking-card">


                    <div className="event-booking-header">


                        <p>

                            TICKET BOOKING

                        </p>


                        <h2>

                            Reserve Your Spot

                        </h2>


                        <span>

                            Select the number of tickets
                            you want to book.

                        </span>


                    </div>


                    {/* =================================
                        PRICE
                    ================================== */}

                    <div className="event-ticket-price">


                        <span>

                            Price per ticket

                        </span>


                        <strong>

                            ₹{event.ticketPrice}

                        </strong>


                    </div>


                    {/* =================================
                        QUANTITY
                    ================================== */}

                    <div className="event-quantity-section">


                        <label>

                            Number of Tickets

                        </label>


                        <div className="event-quantity-selector">


                            <button

                                type="button"

                                onClick={() =>

                                    setQuantity(
                                        (prev) =>
                                            Math.max(
                                                1,
                                                prev - 1
                                            )
                                    )

                                }

                                disabled={
                                    quantity <= 1
                                }

                            >

                                −

                            </button>


                            <div className="event-quantity-value">

                                {quantity}

                            </div>


                            <button

                                type="button"

                                onClick={() =>

                                    setQuantity(
                                        (prev) =>
                                            Math.min(
                                                event.availableSeats,
                                                prev + 1
                                            )
                                    )

                                }

                                disabled={
                                    quantity >=
                                    event.availableSeats
                                }

                            >

                                +

                            </button>


                        </div>


                        <small>

                            Maximum{" "}

                            {
                                event.availableSeats
                            }{" "}

                            tickets available.

                        </small>


                    </div>


                    {/* =================================
                        ORDER SUMMARY
                    ================================== */}

                    <div className="event-order-summary">


                        <div>

                            <span>

                                Ticket Price

                            </span>


                            <strong>

                                ₹{event.ticketPrice}

                            </strong>

                        </div>


                        <div>

                            <span>

                                Quantity

                            </span>


                            <strong>

                                × {quantity}

                            </strong>

                        </div>


                        <hr />


                        <div className="event-order-total">

                            <span>

                                Total Amount

                            </span>


                            <strong>

                                ₹{totalPrice}

                            </strong>

                        </div>


                    </div>


                    {/* =================================
                        PAYMENT BUTTON
                    ================================== */}

                    <button

                        className="event-payment-button"

                        onClick={handlePayment}

                        disabled={

                            paymentLoading ||

                            quantity < 1 ||

                            quantity >
                            event.availableSeats ||

                            event.availableSeats === 0

                        }

                    >

                        {
                            event.availableSeats === 0

                                ? "Sold Out"

                                : paymentLoading

                                    ? "Starting Payment..."

                                    : `Pay & Book ₹${totalPrice}`
                        }

                    </button>


                    <div className="event-secure-payment">


                        <span>

                            🔒

                        </span>


                        <p>

                            Secure payment powered by Razorpay

                        </p>


                    </div>


                </aside>


            </div>


        </div>

    );

};


export default EventDetails;