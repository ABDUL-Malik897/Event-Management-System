import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import API from "../api/api";

import toast from "react-hot-toast";

import jsPDF from "jspdf";

import "./TicketDetails.css";


const TicketDetails = () => {

    const {
        bookingid
    } = useParams();


    const [
        booking,
        setBooking
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        currentPage,
        setCurrentPage
    ] = useState(1);


    const ticketsPerPage = 6;


    // =========================================
    // FETCH BOOKING
    // =========================================

    const fetchBooking =
        useCallback(
            async () => {

                try {

                    const response =
                        await API.get(
                            `/booking/${bookingid}`
                        );


                    setBooking(
                        response.data.booking
                    );


                } catch (error) {

                    console.error(
                        "Fetch Booking Error:",
                        error
                    );


                    toast.error(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load booking details"
                    );


                } finally {

                    setLoading(false);

                }

            },
            [
                bookingid
            ]
        );


    useEffect(() => {

        fetchBooking();

    }, [
        fetchBooking
    ]);


    // =========================================
    // DOWNLOAD TICKET
    // =========================================

    const downloadTicket = (
        ticket
    ) => {

        try {

            const doc =
                new jsPDF();


            // =====================================
            // PDF TITLE
            // =====================================

            doc.setFontSize(
                22
            );


            doc.text(
                "EVENT TICKET",
                60,
                20
            );


            // =====================================
            // EVENT DETAILS
            // =====================================

            doc.setFontSize(
                14
            );


            doc.text(
                `Event : ${booking.event.title}`,
                20,
                40
            );


            doc.text(
                `Date : ${
                    new Date(
                        booking.event.date
                    ).toLocaleDateString()
                }`,
                20,
                50
            );


            doc.text(
                `Venue : ${booking.event.venue}`,
                20,
                60
            );


            doc.text(
                `Seat : ${
                    ticket.seatNumber ||
                    "Not Assigned"
                }`,
                20,
                70
            );


            doc.text(
                `Ticket ID : ${ticket.ticketId}`,
                20,
                80
            );


            doc.text(
                `Status : ${
                    ticket.checkedIn
                        ? "Checked In"
                        : "Not Checked In"
                }`,
                20,
                90
            );


            // =====================================
            // PAYMENT DETAILS
            // =====================================

            doc.text(
                `Payment Status : ${booking.paymentStatus}`,
                20,
                100
            );


            doc.text(
                `Amount Paid : Rs. ${booking.totalAmount}`,
                20,
                110
            );


            if (
                booking.razorpayPaymentId
            ) {

                doc.text(
                    `Payment ID : ${booking.razorpayPaymentId}`,
                    20,
                    120
                );

            }


            // =====================================
            // QR CODE
            // =====================================

            doc.addImage(
                ticket.qrCode,
                "PNG",
                20,
                135,
                60,
                60
            );


            // =====================================
            // SAVE PDF
            // =====================================

            doc.save(
                `${
                    booking.event.title
                }-${
                    ticket.seatNumber ||
                    ticket.ticketId
                }.pdf`
            );


            toast.success(
                "Ticket PDF downloaded successfully"
            );


        } catch (error) {

            console.error(
                "Ticket PDF Download Error:",
                error
            );


            toast.error(
                "Unable to download ticket PDF"
            );

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="ticket-details-loading">

                <div className="ticket-loading-spinner">
                </div>


                <h2>

                    Loading Your Tickets...

                </h2>


                <p>

                    Please wait while we fetch your booking.

                </p>

            </div>

        );

    }


    // =========================================
    // BOOKING NOT FOUND
    // =========================================

    if (!booking) {

        return (

            <div className="ticket-not-found">

                <div className="ticket-not-found-icon">

                    🎫

                </div>


                <h2>

                    Booking Not Found

                </h2>


                <p>

                    We couldn't find the booking you're
                    looking for.

                </p>

            </div>

        );

    }


    // =========================================
    // TICKET PAGINATION
    // =========================================

    const totalTickets =
        booking.tickets?.length ||
        0;


    const totalPages =
        Math.ceil(
            totalTickets /
            ticketsPerPage
        );


    const indexOfLastTicket =
        currentPage *
        ticketsPerPage;


    const indexOfFirstTicket =
        indexOfLastTicket -
        ticketsPerPage;


    const currentTickets =
        booking.tickets.slice(
            indexOfFirstTicket,
            indexOfLastTicket
        );


    // =========================================
    // CHANGE PAGE
    // =========================================

    const handlePageChange = (
        page
    ) => {

        setCurrentPage(
            page
        );


        window.scrollTo({

            top: 500,

            behavior:
                "smooth"

        });

    };


    return (

        <div className="ticket-details-page">


            {/* =========================================
                EVENT HEADER
            ========================================== */}

            <section className="ticket-event-banner">


                <img

                    src={
                        booking.event.banner ||
                        "https://via.placeholder.com/1000x400?text=Event+Banner"
                    }

                    alt={
                        booking.event.title
                    }

                />


                <div className="ticket-banner-overlay">


                    <span className="ticket-booking-badge">

                        CONFIRMED BOOKING

                    </span>


                    <h1>

                        {
                            booking.event.title
                        }

                    </h1>


                    <p>

                        📍 {
                            booking.event.venue
                        }

                    </p>


                </div>


            </section>


            {/* =========================================
                BOOKING SUMMARY
            ========================================== */}

            <section className="ticket-booking-summary">


                <div className="ticket-summary-header">


                    <div>


                        <span>

                            BOOKING DETAILS

                        </span>


                        <h2>

                            Your Event Booking

                        </h2>


                    </div>


                    <div

                        className={
                            `ticket-payment-status ${
                                booking.paymentStatus ===
                                "Paid"
                                    ? "payment-paid"
                                    : "payment-pending"
                            }`
                        }

                    >

                        {
                            booking.paymentStatus ===
                            "Paid"

                                ? "✓ Paid"

                                : booking.paymentStatus
                        }

                    </div>


                </div>


                {/* =====================================
                    EVENT INFORMATION
                ====================================== */}

                <div className="ticket-info-grid">


                    <div className="ticket-info-item">


                        <div className="ticket-info-icon">

                            📅

                        </div>


                        <div>


                            <span>

                                Event Date

                            </span>


                            <strong>

                                {
                                    new Date(
                                        booking.event.date
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day:
                                                "numeric",

                                            month:
                                                "long",

                                            year:
                                                "numeric"
                                        }
                                    )
                                }

                            </strong>


                        </div>


                    </div>


                    <div className="ticket-info-item">


                        <div className="ticket-info-icon">

                            📍

                        </div>


                        <div>


                            <span>

                                Venue

                            </span>


                            <strong>

                                {
                                    booking.event.venue
                                }

                            </strong>


                        </div>


                    </div>


                    <div className="ticket-info-item">


                        <div className="ticket-info-icon">

                            🎟️

                        </div>


                        <div>


                            <span>

                                Total Tickets

                            </span>


                            <strong>

                                {
                                    booking.quantity
                                }

                            </strong>


                        </div>


                    </div>


                    <div className="ticket-info-item">


                        <div className="ticket-info-icon">

                            💳

                        </div>


                        <div>


                            <span>

                                Amount Paid

                            </span>


                            <strong>

                                ₹{
                                    booking.totalAmount
                                }

                            </strong>


                        </div>


                    </div>


                </div>


                {/* =====================================
                    PAYMENT INFORMATION
                ====================================== */}

                {

                    booking.paymentStatus ===
                    "Paid" && (

                        <div className="ticket-payment-details">


                            <h3>

                                Payment Information

                            </h3>


                            <div className="ticket-payment-row">


                                <span>

                                    Payment ID

                                </span>


                                <strong>

                                    {
                                        booking.razorpayPaymentId ||
                                        "Not Available"
                                    }

                                </strong>


                            </div>


                            <div className="ticket-payment-row">


                                <span>

                                    Order ID

                                </span>


                                <strong>

                                    {
                                        booking.razorpayOrderId ||
                                        "Not Available"
                                    }

                                </strong>


                            </div>


                        </div>

                    )

                }


            </section>


            {/* =========================================
                TICKETS SECTION
            ========================================== */}

            <section className="tickets-section">


                <div className="tickets-section-header">


                    <span>

                        DIGITAL TICKETS

                    </span>


                    <h2>

                        Your Tickets

                    </h2>


                    <p>

                        Show the QR code at the event entrance
                        for verification and check-in.

                    </p>


                </div>


                {/* =====================================
                    TICKET GRID
                ====================================== */}

                <div className="tickets-grid">


                    {

                        currentTickets.map(
                            (
                                ticket,
                                index
                            ) => {

                                const actualIndex =
                                    indexOfFirstTicket +
                                    index;


                                return (

                                    <div

                                        key={
                                            ticket.ticketId ||
                                            actualIndex
                                        }

                                        className="digital-ticket"

                                    >


                                        {/* =================================
                                            TICKET HEADER
                                        ================================== */}

                                        <div className="digital-ticket-header">


                                            <div>


                                                <span>

                                                    EVENTHUB TICKET

                                                </span>


                                                <h3>

                                                    Ticket #{
                                                        actualIndex +
                                                        1
                                                    }

                                                </h3>


                                            </div>


                                            <div

                                                className={
                                                    `ticket-checkin-status ${
                                                        ticket.checkedIn
                                                            ? "checked-in"
                                                            : "not-checked-in"
                                                    }`
                                                }

                                            >

                                                {
                                                    ticket.checkedIn
                                                        ? "✓ Checked In"
                                                        : "⏳ Not Checked In"
                                                }

                                            </div>


                                        </div>


                                        {/* =================================
                                            QR CODE
                                        ================================== */}

                                        <div className="ticket-qr-container">


                                            <div className="ticket-qr-wrapper">


                                                <img

                                                    src={
                                                        ticket.qrCode
                                                    }

                                                    alt={
                                                        `QR Code for Ticket ${
                                                            actualIndex +
                                                            1
                                                        }`
                                                    }

                                                />


                                            </div>


                                            <p>

                                                Scan this QR code
                                                at the event entrance

                                            </p>


                                        </div>


                                        {/* =================================
                                            TICKET INFORMATION
                                        ================================== */}

                                        <div className="digital-ticket-info">


                                            <div>


                                                <span>

                                                    Event

                                                </span>


                                                <strong>

                                                    {
                                                        booking.event.title
                                                    }

                                                </strong>


                                            </div>


                                            <div>


                                                <span>

                                                    Seat

                                                </span>


                                                <strong>

                                                    {
                                                        ticket.seatNumber ||
                                                        "Not Assigned"
                                                    }

                                                </strong>


                                            </div>


                                            <div className="ticket-id-row">


                                                <span>

                                                    Ticket ID

                                                </span>


                                                <strong>

                                                    {
                                                        ticket.ticketId
                                                    }

                                                </strong>


                                            </div>


                                        </div>


                                        {/* =================================
                                            CHECK-IN TIME
                                        ================================== */}

                                        {

                                            ticket.checkedIn &&
                                            ticket.checkedInAt && (

                                                <div className="ticket-checkin-info">


                                                    <span>

                                                        ✓

                                                    </span>


                                                    <div>


                                                        <strong>

                                                            Checked In Successfully

                                                        </strong>


                                                        <p>

                                                            {
                                                                new Date(
                                                                    ticket.checkedInAt
                                                                ).toLocaleString()
                                                            }

                                                        </p>


                                                    </div>


                                                </div>

                                            )

                                        }


                                        {/* =================================
                                            DOWNLOAD BUTTON
                                        ================================== */}

                                        <button

                                            type="button"

                                            className="ticket-download-button"

                                            onClick={() =>
                                                downloadTicket(
                                                    ticket
                                                )
                                            }

                                        >


                                            <span>

                                                ↓

                                            </span>


                                            Download Ticket PDF


                                        </button>


                                    </div>

                                );

                            }
                        )

                    }


                </div>


                {/* =====================================
                    PAGINATION
                ====================================== */}

                {

                    totalPages > 1 && (

                        <div className="ticket-pagination">


                            {/* PREVIOUS BUTTON */}

                            <button

                                type="button"

                                className="ticket-pagination-nav"

                                onClick={() =>
                                    handlePageChange(
                                        currentPage -
                                        1
                                    )
                                }

                                disabled={
                                    currentPage ===
                                    1
                                }

                            >

                                ← Previous

                            </button>


                            {/* PAGE NUMBERS */}

                            <div className="ticket-pagination-numbers">


                                {

                                    Array.from(
                                        {
                                            length:
                                                totalPages
                                        },
                                        (
                                            _,
                                            index
                                        ) =>
                                            index +
                                            1
                                    ).map(
                                        (
                                            page
                                        ) => (

                                            <button

                                                type="button"

                                                key={
                                                    page
                                                }

                                                className={
                                                    currentPage ===
                                                    page
                                                        ? "ticket-page-active"
                                                        : ""
                                                }

                                                onClick={() =>
                                                    handlePageChange(
                                                        page
                                                    )
                                                }

                                            >

                                                {
                                                    page
                                                }

                                            </button>

                                        )
                                    )

                                }


                            </div>


                            {/* NEXT BUTTON */}

                            <button

                                type="button"

                                className="ticket-pagination-nav"

                                onClick={() =>
                                    handlePageChange(
                                        currentPage +
                                        1
                                    )
                                }

                                disabled={
                                    currentPage ===
                                    totalPages
                                }

                            >

                                Next →

                            </button>


                        </div>

                    )

                }


            </section>


            {/* =========================================
                IMPORTANT NOTE
            ========================================== */}

            <section className="ticket-important-note">


                <div className="ticket-note-icon">

                    💡

                </div>


                <div>


                    <h3>

                        Important Information

                    </h3>


                    <p>

                        Keep your QR ticket safe and do not
                        share it with others. Each ticket can
                        only be checked in once at the event
                        entrance.

                    </p>


                </div>


            </section>


        </div>

    );

};


export default TicketDetails;