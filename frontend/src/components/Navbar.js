import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthContext from "../hooks/useAuthContext";
import ProfileAvatar from "./ProfileAvatar";
import "./Navbar.css";

const Navbar = () => {

    const { user, dispatch } = useAuthContext();

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("user");

        dispatch({
            type: "LOGOUT"
        });

        setMenuOpen(false);

        toast.success(
            "Logged out successfully"
        );

        navigate("/login");

    };


    // =========================
    // CREATE EVENT
    // =========================

    const handleCreateEvent = () => {

        const isMembershipActive =
            user?.membershipStatus === "active" &&
            user?.membershipExpiry &&
            new Date(user.membershipExpiry) > new Date();


        if (!isMembershipActive) {

            toast.error(
                "You need an active membership to create events."
            );

            navigate("/membership");

            return;

        }


        navigate("/create-event");

    };


    // =========================
    // CLOSE MOBILE MENU
    // =========================

    const closeMenu = () => {

        setMenuOpen(false);

    };


    // =========================
    // NAVLINK CLASS
    // =========================

    const getNavLinkClass = ({
        isActive
    }) => {

        return isActive
            ? "navbar-link navbar-link-active"
            : "navbar-link";

    };


    return (

        <header className="navbar-wrapper">

            <nav className="navbar">


                {/* =========================
                    LOGO
                ========================== */}

                <div className="navbar-brand">

                    <Link
                        to="/"
                        className="navbar-logo"
                        onClick={closeMenu}
                    >

                        <div className="navbar-logo-icon">
                            E
                        </div>

                        <span>
                            Event<span>Hub</span>
                        </span>

                    </Link>

                </div>


                {/* =========================
                    MOBILE MENU BUTTON
                ========================== */}

                <button
                    type="button"
                    className={`navbar-menu-button ${
                        menuOpen
                            ? "navbar-menu-button-open"
                            : ""
                    }`}
                    onClick={() =>
                        setMenuOpen(
                            (prev) => !prev
                        )
                    }
                    aria-label="Toggle navigation"
                >

                    <span></span>
                    <span></span>
                    <span></span>

                </button>


                {/* =========================
                    NAVIGATION
                ========================== */}

                <div
                    className={`navbar-navigation ${
                        menuOpen
                            ? "navbar-navigation-open"
                            : ""
                    }`}
                >


                    {/* =========================
                        COMMON LINKS
                    ========================== */}

                    <div className="navbar-links">

                        <NavLink
                            to="/"
                            end
                            className={getNavLinkClass}
                            onClick={closeMenu}
                        >
                            Home
                        </NavLink>


                        <NavLink
                            to="/events"
                            className={getNavLinkClass}
                            onClick={closeMenu}
                        >
                            Events
                        </NavLink>


                        {/* =========================
                            GUEST LINKS
                        ========================== */}

                        {!user && (

                            <>

                                <NavLink
                                    to="/login"
                                    className={getNavLinkClass}
                                    onClick={closeMenu}
                                >
                                    Login
                                </NavLink>


                                <Link
                                    to="/signup"
                                    className="navbar-signup-button"
                                    onClick={closeMenu}
                                >
                                    Get Started
                                </Link>

                            </>

                        )}


                        {/* =========================
                            USER LINKS
                        ========================== */}

                        {user?.role === "user" && (

                            <>

                                <NavLink
                                    to="/my-booking"
                                    className={getNavLinkClass}
                                    onClick={closeMenu}
                                >
                                    My Bookings
                                </NavLink>


                                <NavLink
                                    to="/payment-history"
                                    className={getNavLinkClass}
                                    onClick={closeMenu}
                                >
                                    Payments
                                </NavLink>


                                <NavLink
                                    to="/become-organizer"
                                    className={getNavLinkClass}
                                    onClick={closeMenu}
                                >
                                    Become Organizer
                                </NavLink>


                                <NavLink
                                    to="/application-status"
                                    className={getNavLinkClass}
                                    onClick={closeMenu}
                                >
                                    Application Status
                                </NavLink>

                            </>

                        )}


                        {/* =========================
                            ORGANIZER LINKS
                        ========================== */}

                        {user?.role === "organizer" && (

                            <>

                                <NavLink
                                    to="/organizer-dashboard"
                                    className={getNavLinkClass}
                                    onClick={closeMenu}
                                >
                                    Dashboard
                                </NavLink>


                                <NavLink
                                    to="/create-event"
                                    className={getNavLinkClass}
                                    onClick={(e) => {

                                        e.preventDefault();

                                        closeMenu();

                                        handleCreateEvent();

                                    }}
                                >
                                    Create Event
                                </NavLink>


                                <NavLink
                                    to="/analytics"
                                    className={getNavLinkClass}
                                    onClick={closeMenu}
                                >
                                    Analytics
                                </NavLink>


                                <NavLink
                                    to="/membership"
                                    className={getNavLinkClass}
                                    onClick={closeMenu}
                                >
                                    Membership
                                </NavLink>


                                <NavLink
                                    to="/scanner"
                                    className="navbar-scanner-link"
                                    onClick={closeMenu}
                                >

                                    <span>
                                        ▣
                                    </span>

                                    QR Scanner

                                </NavLink>

                            </>

                        )}


                        {/* =========================
                            ADMIN LINKS
                        ========================== */}

                        {user?.role === "admin" && (

                            <>

                                <NavLink
                                    to="/admin/dashboard"
                                    className={getNavLinkClass}
                                    onClick={closeMenu}
                                >
                                    Dashboard
                                </NavLink>


                                <NavLink
                                    to="/admin/requests"
                                    className={getNavLinkClass}
                                    onClick={closeMenu}
                                >
                                    Organizer Requests
                                </NavLink>

                            </>

                        )}

                    </div>


                    {/* =========================
                        LOGGED IN USER AREA
                    ========================== */}

                    {user && (

                        <div className="navbar-user-section">


                            {/* ROLE BADGE */}

                            <div
                                className={`navbar-role-badge navbar-role-${user.role}`}
                            >
                                {user.role}
                            </div>


                            {/* USER INFO */}

                            <div className="navbar-user-info">

                                {/* <div className="navbar-user-avatar">

                                    {
                                        user.username
                                            ?.charAt(0)
                                            .toUpperCase() ||
                                        user.email
                                            ?.charAt(0)
                                            .toUpperCase() ||
                                        "U"
                                    }

                                </div> */}

                                <ProfileAvatar
                                    className="navbar-user-avatar"
                                />


                                <div className="navbar-user-details">

                                    <span className="navbar-user-name">

                                        {
                                            user.username ||
                                            "EventHub User"
                                        }

                                    </span>


                                    <span className="navbar-user-role">

                                        {
                                            user.role === "organizer"
                                                ? "Event Organizer"
                                                : user.role === "admin"
                                                ? "Administrator"
                                                : "Event Explorer"
                                        }

                                    </span>

                                </div>

                            </div>


                            {/* LOGOUT */}

                            <button
                                type="button"
                                className="navbar-logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </nav>

        </header>

    );

};

export default Navbar;