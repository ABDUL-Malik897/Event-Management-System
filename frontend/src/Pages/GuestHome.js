import React from "react";
import { Link } from "react-router-dom";
import "./GuestHome.css";

const GuestHome = () => {

    const categories = [
        {
            icon: "🎵",
            title: "Music",
            description: "Concerts, live performances and music festivals."
        },
        {
            icon: "⚽",
            title: "Sports",
            description: "Matches, tournaments and sporting experiences."
        },
        {
            icon: "💻",
            title: "Workshops",
            description: "Learn new skills from interactive workshops."
        },
        {
            icon: "🎤",
            title: "Conferences",
            description: "Connect, learn and discover new ideas."
        },
        {
            icon: "🎉",
            title: "Festivals",
            description: "Celebrate culture, food, music and entertainment."
        },
        {
            icon: "🎓",
            title: "College",
            description: "Discover exciting college events and activities."
        }
    ];


    return (

        <div className="guest-home">


            {/* ========================= */}
            {/* HERO SECTION */}
            {/* ========================= */}

            <section className="guest-hero">

                <div className="guest-hero-content">

                    <p className="guest-label">
                        DISCOVER • BOOK • EXPERIENCE
                    </p>

                    <h1>
                        Great experiences start with
                        the right event.
                    </h1>

                    <p className="guest-hero-description">
                        Discover concerts, workshops, conferences,
                        festivals and unforgettable experiences.
                        Book your tickets securely and keep everything
                        you need in one place.
                    </p>


                    <div className="guest-hero-buttons">

                        <Link
                            to="/events"
                            className="guest-primary-btn"
                        >
                            Explore Events
                        </Link>

                        <Link
                            to="/signup"
                            className="guest-secondary-btn"
                        >
                            Create Account
                        </Link>

                    </div>


                    <p className="guest-hero-note">
                        Find your next experience on EventHub.
                    </p>

                </div>


                <div className="guest-hero-visual">

                    <div className="guest-visual-main">

                        <span className="guest-visual-icon">
                            🎟️
                        </span>

                        <h2>
                            Your next event is waiting
                        </h2>

                        <p>
                            Music • Sports • Workshops • Festivals
                        </p>

                    </div>


                    <div className="guest-floating-card guest-floating-one">

                        <span>🎵</span>

                        <div>
                            <strong>Live Music</strong>
                            <p>Discover concerts</p>
                        </div>

                    </div>


                    <div className="guest-floating-card guest-floating-two">

                        <span>🎉</span>

                        <div>
                            <strong>Festivals</strong>
                            <p>Find experiences</p>
                        </div>

                    </div>

                </div>

            </section>


            {/* ========================= */}
            {/* INTRO SECTION */}
            {/* ========================= */}

            <section className="guest-intro">

                <p className="guest-label">
                    YOUR EVENT DESTINATION
                </p>

                <h2>
                    There's always something happening.
                </h2>

                <p>
                    Whether you're looking for an unforgettable
                    concert, an inspiring conference, a hands-on
                    workshop or a weekend festival, EventHub helps
                    you discover experiences worth attending.
                </p>

            </section>


            {/* ========================= */}
            {/* CATEGORIES */}
            {/* ========================= */}

            <section className="guest-section">

                <div className="guest-section-heading">

                    <div>

                        <p className="guest-label">
                            EXPLORE
                        </p>

                        <h2>
                            Find something you'll love
                        </h2>

                        <p>
                            Explore events across different
                            categories and interests.
                        </p>

                    </div>


                    <Link
                        to="/events"
                        className="guest-view-all"
                    >
                        Browse All Events →
                    </Link>

                </div>


                <div className="guest-category-grid">

                    {categories.map((category) => (

                        <Link
                            key={category.title}
                            to={`/events?category=${category.title}`}
                            className="guest-category-card"
                        >

                            <span className="guest-category-icon">
                                {category.icon}
                            </span>

                            <h3>
                                {category.title}
                            </h3>

                            <p>
                                {category.description}
                            </p>

                            <span className="guest-category-explore">
                                Explore →
                            </span>

                        </Link>

                    ))}

                </div>

            </section>


            {/* ========================= */}
            {/* DISCOVERY BANNER */}
            {/* ========================= */}

            <section className="guest-discovery">

                <div className="guest-discovery-content">

                    <p className="guest-label">
                        DISCOVER MORE
                    </p>

                    <h2>
                        From local experiences to
                        unforgettable events.
                    </h2>

                    <p>
                        Explore events that match your interests,
                        discover something new and make your next
                        plan with EventHub.
                    </p>

                    <Link
                        to="/events"
                        className="guest-primary-btn"
                    >
                        Discover Events
                    </Link>

                </div>


                <div className="guest-discovery-cards">

                    <div className="guest-mini-event">
                        <span>🎸</span>
                        <div>
                            <h4>Live Experiences</h4>
                            <p>Feel the energy in person.</p>
                        </div>
                    </div>


                    <div className="guest-mini-event">
                        <span>🧠</span>
                        <div>
                            <h4>Learn Something New</h4>
                            <p>Workshops and conferences.</p>
                        </div>
                    </div>


                    <div className="guest-mini-event">
                        <span>🌟</span>
                        <div>
                            <h4>Create Memories</h4>
                            <p>Experiences worth remembering.</p>
                        </div>
                    </div>

                </div>

            </section>


            {/* ========================= */}
            {/* WHY EVENTHUB */}
            {/* ========================= */}

            <section className="guest-section guest-why-section">

                <div className="guest-centered-heading">

                    <p className="guest-label">
                        WHY EVENTHUB
                    </p>

                    <h2>
                        Your events. Your tickets.
                        One simple platform.
                    </h2>

                    <p>
                        Everything you need to discover, book and
                        attend events with confidence.
                    </p>

                </div>


                <div className="guest-benefits-grid">


                    <div className="guest-benefit-card">

                        <div className="guest-benefit-icon">
                            🔍
                        </div>

                        <h3>
                            Easy Discovery
                        </h3>

                        <p>
                            Explore events across categories and
                            find experiences that match your interests.
                        </p>

                    </div>


                    <div className="guest-benefit-card">

                        <div className="guest-benefit-icon">
                            🔒
                        </div>

                        <h3>
                            Secure Booking
                        </h3>

                        <p>
                            Book event tickets through a simple and
                            secure online payment experience.
                        </p>

                    </div>


                    <div className="guest-benefit-card">

                        <div className="guest-benefit-icon">
                            🎟️
                        </div>

                        <h3>
                            Digital QR Tickets
                        </h3>

                        <p>
                            Access unique digital QR tickets directly
                            from your EventHub account.
                        </p>

                    </div>


                    <div className="guest-benefit-card">

                        <div className="guest-benefit-icon">
                            ⚡
                        </div>

                        <h3>
                            Quick Check-In
                        </h3>

                        <p>
                            Use your QR ticket at the venue for a
                            simple and convenient check-in experience.
                        </p>

                    </div>


                </div>

            </section>


            {/* ========================= */}
            {/* ORGANIZER SECTION */}
            {/* ========================= */}

            <section className="guest-organizer">

                <div className="guest-organizer-content">

                    <p className="guest-label">
                        FOR EVENT CREATORS
                    </p>

                    <h2>
                        Have an idea worth bringing
                        people together for?
                    </h2>

                    <p>
                        Join EventHub as an organizer and get the
                        tools you need to create events, manage
                        attendees, track ticket sales and simplify
                        event check-ins.
                    </p>


                    <div className="guest-organizer-features">

                        <span>✓ Create & manage events</span>

                        <span>✓ Track ticket sales</span>

                        <span>✓ Manage attendees</span>

                        <span>✓ QR ticket check-in</span>

                    </div>


                    <Link
                        to="/signup"
                        className="guest-primary-btn"
                    >
                        Start Organizing
                    </Link>

                </div>


                <div className="guest-organizer-visual">

                    <div className="guest-dashboard-preview">

                        <p className="preview-label">
                            ORGANIZER DASHBOARD
                        </p>

                        <h3>
                            Your events at a glance
                        </h3>


                        <div className="preview-stats">

                            <div>
                                <span>Events</span>
                                <strong>12</strong>
                            </div>

                            <div>
                                <span>Tickets</span>
                                <strong>840</strong>
                            </div>

                            <div>
                                <span>Attendance</span>
                                <strong>92%</strong>
                            </div>

                        </div>


                        <div className="preview-event">

                            <span>Upcoming Event</span>

                            <strong>
                                Your Next Amazing Event
                            </strong>

                            <div className="preview-progress">
                                <div></div>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================= */}
            {/* FINAL CTA */}
            {/* ========================= */}

            <section className="guest-final-cta">

                <p className="guest-label">
                    READY TO EXPLORE?
                </p>

                <h2>
                    Your next great experience
                    could be one click away.
                </h2>

                <p>
                    Create your EventHub account and start
                    discovering events today.
                </p>


                <div className="guest-final-buttons">

                    <Link
                        to="/signup"
                        className="guest-primary-btn"
                    >
                        Create Free Account
                    </Link>

                    <Link
                        to="/events"
                        className="guest-secondary-btn"
                    >
                        Browse Events
                    </Link>

                </div>

            </section>


        </div>

    );

};

export default GuestHome;