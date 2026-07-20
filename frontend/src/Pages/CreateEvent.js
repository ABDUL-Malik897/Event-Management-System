import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/api";
import "./CreateEvent.css";
import useAuthContext from "../hooks/useAuthContext";

const CreateEvent = () => {

    const navigate = useNavigate();
    const { dispatch } = useAuthContext()
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Other",
        date: "",
        time: "",
        venue: "",
        city: "",
        ticketPrice: "",
        totalSeats: "",
        banner: ""
    });

    const [loading, setLoading] = useState(false);


    // =========================================
    // CHECK ORGANIZER MEMBERSHIP
    // =========================================

    useEffect(() => {

        const auth = JSON.parse(
            localStorage.getItem("user")
        );

        if (
            auth?.role === "organizer" &&
            auth?.membershipStatus !== "active"
        ) {

            toast.error(
                "Please activate your membership first."
            );

            navigate("/membership");

        }

    }, [navigate]);


    // =========================================
    // HANDLE INPUT CHANGE
    // =========================================

    const handleChange = (e) => {

        setFormData((prev) => ({

            ...prev,

            [e.target.name]:
                e.target.value

        }));

    };


    // =========================================
    // HANDLE FORM SUBMIT
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }

        try {

            setLoading(true);

            const response = await API.post(
                "/events",
                formData
            );

            toast.success(
                response.data.message ||
                "Event created successfully"
            );

            navigate(
                "/organizer-dashboard"
            );

        } catch (error) {

            console.error(
                "Create Event Error:",
                error
            );


            if (
                error.response?.data?.membershipExpired
            ) {

                toast.error(
                    error.response.data.message ||
                    "Your membership has expired"
                );


                const auth = JSON.parse(
                    localStorage.getItem("user")
                );


                if (auth) {

                    const updatedAuth = {
                        ...auth,
                        membershipStatus: "inactive"
                    };


                    localStorage.setItem(
                        "user",
                        JSON.stringify(updatedAuth)
                    );


                    dispatch({
                        type: "LOGIN",
                        payload: updatedAuth
                    });

                }


                navigate(
                    "/membership",
                    {
                        replace: true
                    }
                );

                return;

            }


            toast.error(
                error.response?.data?.message ||
                "Unable to create event"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="create-event-page">


            {/* =========================================
                HEADER
            ========================================== */}

            <section className="create-event-header">

                <div className="create-event-header-content">

                    <p className="create-event-label">
                        EVENT CREATION
                    </p>

                    <h1>
                        Create Your Next Event
                    </h1>

                    <p>

                        Bring your event idea to life.
                        Add the event details, set your
                        ticket price and capacity, and
                        publish it for attendees to discover.

                    </p>

                </div>


                <div className="create-event-header-icon">
                    🎉
                </div>

            </section>


            {/* =========================================
                FORM CONTAINER
            ========================================== */}

            <section className="create-event-container">


                {/* FORM HEADER */}

                <div className="create-event-form-header">

                    <div>

                        <p>
                            NEW EVENT
                        </p>

                        <h2>
                            Event Information
                        </h2>

                        <span>

                            Fill in the information below
                            to create your event.

                        </span>

                    </div>


                    <div className="create-event-form-icon">
                        📝
                    </div>

                </div>


                {/* =========================================
                    FORM
                ========================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="create-event-form"
                >


                    {/* =========================================
                        BASIC INFORMATION
                    ========================================== */}

                    <div className="create-event-form-section">

                        <div className="create-event-section-heading">

                            <span>
                                01
                            </span>

                            <div>

                                <h3>
                                    Basic Information
                                </h3>

                                <p>

                                    Tell attendees what
                                    your event is about.

                                </p>

                            </div>

                        </div>


                        {/* EVENT TITLE */}

                        <div className="create-event-field">

                            <label htmlFor="title">
                                Event Title
                            </label>

                            <input
                                id="title"
                                type="text"
                                name="title"
                                placeholder="Enter your event title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="create-event-field">

                            <label htmlFor="description">
                                Event Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                placeholder="Describe your event, what attendees can expect, and other important details..."
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                required
                            />

                            <span className="create-event-field-hint">
                                Give attendees a clear idea
                                of what your event offers.
                            </span>

                        </div>


                        {/* CATEGORY */}

                        <div className="create-event-field">

                            <label htmlFor="category">
                                Event Category
                            </label>

                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >

                                <option value="Music">
                                    Music
                                </option>

                                <option value="Sports">
                                    Sports
                                </option>

                                <option value="Workshop">
                                    Workshop
                                </option>

                                <option value="Conference">
                                    Conference
                                </option>

                                <option value="Festival">
                                    Festival
                                </option>

                                <option value="College">
                                    College
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* =========================================
                        DATE & TIME
                    ========================================== */}

                    <div className="create-event-form-section">

                        <div className="create-event-section-heading">

                            <span>
                                02
                            </span>

                            <div>

                                <h3>
                                    Date & Time
                                </h3>

                                <p>
                                    When will your event happen?
                                </p>

                            </div>

                        </div>


                        <div className="create-event-two-columns">


                            {/* DATE */}

                            <div className="create-event-field">

                                <label htmlFor="date">
                                    Event Date
                                </label>

                                <input
                                    id="date"
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* TIME */}

                            <div className="create-event-field">

                                <label htmlFor="time">
                                    Event Time
                                </label>

                                <input
                                    id="time"
                                    type="text"
                                    name="time"
                                    placeholder="Example: 10:00 AM"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                        </div>

                    </div>


                    {/* =========================================
                        LOCATION
                    ========================================== */}

                    <div className="create-event-form-section">

                        <div className="create-event-section-heading">

                            <span>
                                03
                            </span>

                            <div>

                                <h3>
                                    Event Location
                                </h3>

                                <p>

                                    Let attendees know where
                                    your event will take place.

                                </p>

                            </div>

                        </div>


                        <div className="create-event-two-columns">


                            {/* VENUE */}

                            <div className="create-event-field">

                                <label htmlFor="venue">
                                    Venue
                                </label>

                                <input
                                    id="venue"
                                    type="text"
                                    name="venue"
                                    placeholder="Example: Grand Convention Hall"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* CITY */}

                            <div className="create-event-field">

                                <label htmlFor="city">
                                    City
                                </label>

                                <input
                                    id="city"
                                    type="text"
                                    name="city"
                                    placeholder="Example: Lucknow"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                        </div>

                    </div>


                    {/* =========================================
                        TICKETS
                    ========================================== */}

                    <div className="create-event-form-section">

                        <div className="create-event-section-heading">

                            <span>
                                04
                            </span>

                            <div>

                                <h3>
                                    Ticket Details
                                </h3>

                                <p>

                                    Set your ticket price
                                    and event capacity.

                                </p>

                            </div>

                        </div>


                        <div className="create-event-two-columns">


                            {/* TICKET PRICE */}

                            <div className="create-event-field">

                                <label htmlFor="ticketPrice">
                                    Ticket Price
                                </label>

                                <div className="create-event-price-input">

                                    <span>
                                        ₹
                                    </span>

                                    <input
                                        id="ticketPrice"
                                        type="number"
                                        name="ticketPrice"
                                        placeholder="0"
                                        min="0"
                                        value={formData.ticketPrice}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* TOTAL SEATS */}

                            <div className="create-event-field">

                                <label htmlFor="totalSeats">
                                    Total Seats
                                </label>

                                <input
                                    id="totalSeats"
                                    type="number"
                                    name="totalSeats"
                                    placeholder="Enter event capacity"
                                    min="1"
                                    value={formData.totalSeats}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                        </div>

                    </div>


                    {/* =========================================
                        EVENT BANNER
                    ========================================== */}

                    <div className="create-event-form-section">

                        <div className="create-event-section-heading">

                            <span>
                                05
                            </span>

                            <div>

                                <h3>
                                    Event Banner
                                </h3>

                                <p>

                                    Add an attractive image
                                    for your event.

                                </p>

                            </div>

                        </div>


                        <div className="create-event-field">

                            <label htmlFor="banner">
                                Banner Image URL
                            </label>

                            <input
                                id="banner"
                                type="text"
                                name="banner"
                                placeholder="https://example.com/event-banner.jpg"
                                value={formData.banner}
                                onChange={handleChange}
                            />

                            <span className="create-event-field-hint">

                                Paste the URL of the image
                                you want to use as your
                                event banner.

                            </span>

                        </div>


                        {/* BANNER PREVIEW */}

                        {formData.banner && (

                            <div className="create-event-banner-preview">

                                <p>
                                    BANNER PREVIEW
                                </p>

                                <div>

                                    <img
                                        src={formData.banner}
                                        alt="Event Banner Preview"
                                    />

                                </div>

                            </div>

                        )}

                    </div>


                    {/* =========================================
                        SUBMIT
                    ========================================== */}

                    <div className="create-event-submit-section">

                        <div>

                            <h3>
                                Ready to create your event?
                            </h3>

                            <p>

                                Make sure all your event
                                information is correct before
                                creating the event.

                            </p>

                        </div>


                        <button
                            type="submit"
                            className="create-event-submit-btn"
                            disabled={loading}
                        >

                            {
                                loading
                                    ? "Creating Event..."
                                    : "Create Event"
                            }

                            {!loading && (
                                <span>
                                    →
                                </span>
                            )}

                        </button>

                    </div>


                </form>

            </section>

        </div>

    );

};

export default CreateEvent;