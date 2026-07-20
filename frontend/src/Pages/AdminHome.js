import React from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import "./AdminHome.css";

const AdminHome = () => {

    const { user } = useAuthContext();

    return (

        <div className="admin-home">

            {/* HERO SECTION */}

            <section className="admin-hero">

                <div className="admin-hero-content">

                    <span className="admin-badge">
                        EVENTHUB ADMIN PANEL
                    </span>

                    <h1>
                        Welcome back,
                        <span>
                            {" "}
                            {user?.username || "Admin"}
                        </span>
                    </h1>

                    <p>
                        Manage EventHub from one central dashboard.
                        Review organizer applications, monitor events,
                        and keep the platform running smoothly.
                    </p>

                    <div className="admin-hero-buttons">

                        <Link
                            to="/admin/dashboard"
                            className="admin-primary-btn"
                        >
                            Open Dashboard
                        </Link>

                        <Link
                            to="/admin/requests"
                            className="admin-secondary-btn"
                        >
                            Organizer Requests
                        </Link>

                    </div>

                </div>


                <div className="admin-hero-visual">

                    <div className="admin-visual-icon">
                        🛡️
                    </div>

                    <h2>
                        Platform Control Center
                    </h2>

                    <p>
                        Manage and monitor your EventHub platform.
                    </p>

                </div>

            </section>


            {/* MANAGEMENT SECTION */}

            <section className="admin-management">

                <div className="admin-section-heading">

                    <span>
                        ADMINISTRATION
                    </span>

                    <h2>
                        Manage Your Platform
                    </h2>

                    <p>
                        Access important administration tools
                        and manage EventHub efficiently.
                    </p>

                </div>


                <div className="admin-management-grid">


                    {/* ADMIN DASHBOARD */}

                    <Link
                        to="/admin/dashboard"
                        className="admin-management-card"
                    >

                        <div className="admin-card-icon">
                            📊
                        </div>

                        <h3>
                            Platform Dashboard
                        </h3>

                        <p>
                            Monitor users, organizers, events,
                            growth and overall platform activity.
                        </p>

                        <span>
                            Open Dashboard →
                        </span>

                    </Link>


                    {/* ORGANIZER REQUESTS */}

                    <Link
                        to="/admin/requests"
                        className="admin-management-card"
                    >

                        <div className="admin-card-icon">
                            👤
                        </div>

                        <h3>
                            Organizer Requests
                        </h3>

                        <p>
                            Review applications from users who
                            want to become event organizers.
                        </p>

                        <span>
                            Review Requests →
                        </span>

                    </Link>


                    {/* EVENTS */}

                    <Link
                        to="/events"
                        className="admin-management-card"
                    >

                        <div className="admin-card-icon">
                            🎪
                        </div>

                        <h3>
                            Platform Events
                        </h3>

                        <p>
                            Browse events currently available
                            across the EventHub platform.
                        </p>

                        <span>
                            View Events →
                        </span>

                    </Link>


                    {/* PAYMENTS */}

                    <div className="admin-management-card">

                        <div className="admin-card-icon">
                            💳
                        </div>

                        <h3>
                            Payments
                        </h3>

                        <p>
                            Monitor platform payments and
                            organizer membership transactions.
                        </p>

                        <span className="admin-coming-soon">
                            Coming Soon
                        </span>

                    </div>

                </div>

            </section>


            {/* INFO BANNER */}

            <section className="admin-info-banner">

                <div>

                    <span className="admin-info-label">
                        EVENTHUB MANAGEMENT
                    </span>

                    <h2>
                        Keep EventHub safe and organized.
                    </h2>

                    <p>
                        Review organizer applications carefully
                        and monitor platform activities from your
                        administrator dashboard.
                    </p>

                </div>


                <Link
                    to="/admin/dashboard"
                    className="admin-banner-btn"
                >
                    Open Admin Dashboard
                </Link>

            </section>

        </div>

    );

};

export default AdminHome;