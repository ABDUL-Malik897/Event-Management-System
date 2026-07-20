import React from "react";
import { Link } from "react-router-dom";
import "./OrganizerHome.css";

const OrganizerHome = () => {

    return (

        <div className="organizer-home-page">


            {/* =====================================
                HERO SECTION
            ====================================== */}

            <section className="organizer-home-hero">

                <div className="organizer-home-hero-content">

                    <p className="organizer-home-label">
                        EVENTHUB FOR ORGANIZERS
                    </p>

                    <h1>
                        Create Experiences
                        <span> People Remember.</span>
                    </h1>

                    <p className="organizer-home-description">

                        Everything you need to create, manage,
                        and grow successful events. Manage your
                        attendees, track performance, and deliver
                        seamless event experiences — all from
                        one powerful platform.

                    </p>


                    <div className="organizer-home-hero-buttons">

                        <Link
                            to="/create-event"
                            className="organizer-home-primary-btn"
                        >
                            Create New Event
                            <span>→</span>
                        </Link>


                        <Link
                            to="/organizer-dashboard"
                            className="organizer-home-secondary-btn"
                        >
                            Open Dashboard
                        </Link>

                    </div>


                    {/* HERO STATS */}

                    <div className="organizer-home-hero-stats">

                        <div>

                            <strong>
                                Create
                            </strong>

                            <span>
                                Unlimited Events
                            </span>

                        </div>


                        <div>

                            <strong>
                                Track
                            </strong>

                            <span>
                                Event Analytics
                            </span>

                        </div>


                        <div>

                            <strong>
                                Scan
                            </strong>

                            <span>
                                QR Check-In
                            </span>

                        </div>

                    </div>

                </div>


                {/* HERO VISUAL */}

                <div className="organizer-home-visual">

                    <div className="organizer-home-visual-main">

                        <div className="organizer-visual-top">

                            <span>
                                LIVE EVENT
                            </span>

                            <span className="organizer-live-dot">
                            </span>

                        </div>


                        <div className="organizer-visual-icon">
                            🎉
                        </div>


                        <h3>
                            Your Next Big Event
                        </h3>

                        <p>
                            Create. Manage. Celebrate.
                        </p>


                        <div className="organizer-visual-progress">

                            <div>
                            </div>

                        </div>


                        <div className="organizer-visual-stats">

                            <div>

                                <strong>
                                    500+
                                </strong>

                                <span>
                                    Attendees
                                </span>

                            </div>


                            <div>

                                <strong>
                                    85%
                                </strong>

                                <span>
                                    Booked
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="organizer-floating-card organizer-floating-ticket">

                        <span>
                            🎟️
                        </span>

                        <div>

                            <strong>
                                Ticket Sold
                            </strong>

                            <p>
                                New booking received
                            </p>

                        </div>

                    </div>


                    <div className="organizer-floating-card organizer-floating-scan">

                        <span>
                            ✓
                        </span>

                        <div>

                            <strong>
                                Checked In
                            </strong>

                            <p>
                                QR verified successfully
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================
                QUICK ACTIONS
            ====================================== */}

            <section className="organizer-home-section">

                <div className="organizer-home-section-header">

                    <div>

                        <p className="organizer-section-small-label">
                            QUICK ACTIONS
                        </p>

                        <h2>
                            What would you like to do?
                        </h2>

                    </div>

                    <p>

                        Access your most important organizer
                        tools in one place.

                    </p>

                </div>


                <div className="organizer-action-grid">


                    {/* DASHBOARD */}

                    <Link
                        to="/organizer-dashboard"
                        className="organizer-action-card"
                    >

                        <div className="organizer-action-icon organizer-dashboard-icon">
                            📊
                        </div>

                        <h3>
                            Organizer Dashboard
                        </h3>

                        <p>

                            View your events, ticket sales,
                            revenue, and overall event activity.

                        </p>

                        <span className="organizer-action-link">
                            View Dashboard →
                        </span>

                    </Link>


                    {/* CREATE EVENT */}

                    <Link
                        to="/create-event"
                        className="organizer-action-card"
                    >

                        <div className="organizer-action-icon organizer-create-icon">
                            ＋
                        </div>

                        <h3>
                            Create an Event
                        </h3>

                        <p>

                            Publish a new event and start
                            accepting bookings from attendees.

                        </p>

                        <span className="organizer-action-link">
                            Create Event →
                        </span>

                    </Link>


                    {/* ANALYTICS */}

                    <Link
                        to="/analytics"
                        className="organizer-action-card"
                    >

                        <div className="organizer-action-icon organizer-analytics-icon">
                            📈
                        </div>

                        <h3>
                            Event Analytics
                        </h3>

                        <p>

                            Understand ticket sales, revenue,
                            attendance and event performance.

                        </p>

                        <span className="organizer-action-link">
                            View Analytics →
                        </span>

                    </Link>


                    {/* QR SCANNER */}

                    <Link
                        to="/scanner"
                        className="organizer-action-card"
                    >

                        <div className="organizer-action-icon organizer-scanner-icon">
                            ▣
                        </div>

                        <h3>
                            QR Ticket Scanner
                        </h3>

                        <p>

                            Scan attendee QR tickets and
                            manage fast, secure event check-ins.

                        </p>

                        <span className="organizer-action-link">
                            Open Scanner →
                        </span>

                    </Link>


                </div>

            </section>


            {/* =====================================
                ORGANIZER TOOLS
            ====================================== */}

            <section className="organizer-tools-section">

                <div className="organizer-tools-content">

                    <p className="organizer-section-small-label">
                        BUILT FOR ORGANIZERS
                    </p>

                    <h2>
                        Everything You Need to Run
                        Successful Events
                    </h2>

                    <p className="organizer-tools-description">

                        From publishing your first event to
                        checking in your final attendee,
                        EventHub gives you the tools to manage
                        the entire event lifecycle.

                    </p>


                    <div className="organizer-tools-list">


                        <div className="organizer-tool-item">

                            <div className="organizer-tool-number">
                                01
                            </div>

                            <div>

                                <h3>
                                    Event Management
                                </h3>

                                <p>

                                    Create, edit and manage
                                    all your events from one
                                    centralized dashboard.

                                </p>

                            </div>

                        </div>


                        <div className="organizer-tool-item">

                            <div className="organizer-tool-number">
                                02
                            </div>

                            <div>

                                <h3>
                                    Ticket Management
                                </h3>

                                <p>
                                    Track ticket availability,
                                    bookings and attendee
                                    information efficiently.
                                </p>

                            </div>

                        </div>


                        <div className="organizer-tool-item">

                            <div className="organizer-tool-number">
                                03
                            </div>

                            <div>

                                <h3>
                                    Smart Check-In
                                </h3>

                                <p>

                                    Verify tickets instantly
                                    using QR scanning and prevent
                                    duplicate event entry.

                                </p>

                            </div>

                        </div>


                        <div className="organizer-tool-item">

                            <div className="organizer-tool-number">
                                04
                            </div>

                            <div>

                                <h3>
                                    Performance Insights
                                </h3>

                                <p>

                                    Track event performance,
                                    ticket sales and revenue
                                    with powerful analytics.

                                </p>

                            </div>

                        </div>


                    </div>

                </div>


                {/* RIGHT VISUAL */}

                <div className="organizer-tools-visual">

                    <div className="organizer-dashboard-preview">

                        <div className="organizer-preview-header">

                            <div>

                                <span>
                                    ORGANIZER OVERVIEW
                                </span>

                                <h3>
                                    Event Performance
                                </h3>

                            </div>

                            <div className="organizer-preview-menu">
                                •••
                            </div>

                        </div>


                        <div className="organizer-preview-cards">


                            <div>

                                <span>
                                    Events
                                </span>

                                <strong>
                                    12
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Tickets
                                </span>

                                <strong>
                                    1,240
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Revenue
                                </span>

                                <strong>
                                    ₹48K
                                </strong>

                            </div>


                        </div>


                        <div className="organizer-preview-chart">

                            <div className="organizer-chart-bar bar-one">
                            </div>

                            <div className="organizer-chart-bar bar-two">
                            </div>

                            <div className="organizer-chart-bar bar-three">
                            </div>

                            <div className="organizer-chart-bar bar-four">
                            </div>

                            <div className="organizer-chart-bar bar-five">
                            </div>

                            <div className="organizer-chart-bar bar-six">
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================
                EVENT MANAGEMENT SECTION
            ====================================== */}

            <section className="organizer-management-section">

                <div className="organizer-management-header">

                    <p className="organizer-section-small-label">
                        YOUR EVENT JOURNEY
                    </p>

                    <h2>
                        From Idea to Event Day
                    </h2>

                    <p>

                        EventHub helps you stay in control
                        throughout every stage of your event.

                    </p>

                </div>


                <div className="organizer-management-grid">


                    <div className="organizer-management-card">

                        <span>
                            ✨
                        </span>

                        <h3>
                            Plan
                        </h3>

                        <p>

                            Add event information, venue,
                            ticket prices and availability.

                        </p>

                    </div>


                    <div className="organizer-management-card">

                        <span>
                            🚀
                        </span>

                        <h3>
                            Publish
                        </h3>

                        <p>

                            Make your event available for
                            users to discover and book.

                        </p>

                    </div>


                    <div className="organizer-management-card">

                        <span>
                            📈
                        </span>

                        <h3>
                            Track
                        </h3>

                        <p>

                            Monitor bookings, ticket sales
                            and attendee information.

                        </p>

                    </div>


                    <div className="organizer-management-card">

                        <span>
                            🎉
                        </span>

                        <h3>
                            Host
                        </h3>

                        <p>

                            Scan tickets, manage attendance
                            and deliver an amazing experience.

                        </p>

                    </div>


                </div>

            </section>


            {/* =====================================
                CTA
            ====================================== */}

            <section className="organizer-home-cta">

                <div>

                    <p>
                        READY TO CREATE SOMETHING AMAZING?
                    </p>

                    <h2>
                        Your Next Great Event
                        Starts Here.
                    </h2>

                    <span>

                        Bring your event ideas to life
                        and create experiences your
                        attendees will remember.

                    </span>

                </div>


                <Link
                    to="/create-event"
                    className="organizer-cta-button"
                >

                    Create Your Event

                    <span>
                        →
                    </span>

                </Link>

            </section>


        </div>

    );

};

export default OrganizerHome;