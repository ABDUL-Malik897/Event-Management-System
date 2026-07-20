import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/api";
import "./EditEvent.css";


const EditEvent = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    const [event, setEvent] = useState({

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


    const [loading, setLoading] =
        useState(true);


    const [updating, setUpdating] =
        useState(false);


    const [error, setError] =
        useState("");


    // =========================================
    // FETCH EVENT
    // =========================================

    const fetchEvent = useCallback(
        async () => {

            try {

                setLoading(true);

                setError("");


                const res =
                    await API.get(
                        `/events/${id}`
                    );


                const eventData =
                    res.data.event;


                setEvent({

                    title:
                        eventData.title || "",

                    description:
                        eventData.description || "",

                    category:
                        eventData.category || "Other",

                    date:
                        eventData.date
                            ? eventData.date.split("T")[0]
                            : "",

                    time:
                        eventData.time || "",

                    venue:
                        eventData.venue || "",

                    city:
                        eventData.city || "",

                    ticketPrice:
                        eventData.ticketPrice || "",

                    totalSeats:
                        eventData.totalSeats || "",

                    banner:
                        eventData.banner || ""

                });


            } catch (error) {

                console.error(
                    "Fetch Event Error:",
                    error
                );


                setError(

                    error.response
                        ?.data
                        ?.message ||

                    "Failed to load event."

                );


            } finally {

                setLoading(false);

            }

        },

        [id]

    );


    useEffect(() => {

        fetchEvent();

    }, [fetchEvent]);


    // =========================================
    // HANDLE INPUT
    // =========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setEvent((prev) => ({

            ...prev,

            [name]: value

        }));

    };


    // =========================================
    // UPDATE EVENT
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (updating) {
            return;
        }

        try {

            setUpdating(true);

            const response = await API.put(
                `/events/${id}`,
                event
            );

            toast.success(
                response.data.message ||
                "Event updated successfully"
            );

            navigate(
                "/organizer-dashboard"
            );

        } catch (error) {

            console.error(
                "Update Event Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update event"
            );

        } finally {

            setUpdating(false);

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="edit-event-loading">

                <div className="edit-event-loader">
                </div>

                <h2>
                    Loading Event...
                </h2>

                <p>
                    Getting your event details.
                </p>

            </div>

        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div className="edit-event-error">

                <div className="edit-event-error-icon">

                    !

                </div>

                <h2>
                    Unable to Load Event
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={fetchEvent}
                >
                    Try Again
                </button>

            </div>

        );

    }


    return (

        <div className="edit-event-page">


            {/* =========================================
                HERO
            ========================================== */}

            <section className="edit-event-hero">


                <div>

                    <p className="edit-event-label">
                        EVENT MANAGEMENT
                    </p>

                    <h1>
                        Edit Event
                    </h1>

                    <p>

                        Update your event information,
                        schedule, venue and ticket details.

                    </p>

                </div>


                <div className="edit-event-hero-icon">

                    ✏️

                </div>


            </section>


            {/* =========================================
                FORM
            ========================================== */}

            <section className="edit-event-section">


                <div className="edit-event-section-header">

                    <p>
                        EVENT DETAILS
                    </p>

                    <h2>
                        Update Event Information
                    </h2>

                    <span>

                        Make changes to your event
                        information below.

                    </span>

                </div>


                <form
                    className="edit-event-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================
                        BASIC INFORMATION
                    ================================== */}

                    <div className="edit-event-form-section">


                        <div className="edit-event-form-title">

                            <div>
                                📝
                            </div>

                            <span>

                                <strong>
                                    Basic Information
                                </strong>

                                <small>
                                    Update your event name
                                    and description.
                                </small>

                            </span>

                        </div>


                        <div className="edit-event-field">

                            <label>
                                Event Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={event.title}
                                onChange={handleChange}
                                placeholder="Enter event title"
                                required
                            />

                        </div>


                        <div className="edit-event-field">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={event.description}
                                onChange={handleChange}
                                placeholder="Describe your event..."
                                rows="5"
                                required
                            />

                        </div>


                        <div className="edit-event-field">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={event.category}
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


                    {/* =================================
                        DATE AND LOCATION
                    ================================== */}

                    <div className="edit-event-form-section">


                        <div className="edit-event-form-title">

                            <div>
                                📍
                            </div>

                            <span>

                                <strong>
                                    Schedule & Location
                                </strong>

                                <small>
                                    Update when and where
                                    your event takes place.
                                </small>

                            </span>

                        </div>


                        <div className="edit-event-grid">


                            <div className="edit-event-field">

                                <label>
                                    Event Date
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    value={event.date}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="edit-event-field">

                                <label>
                                    Event Time
                                </label>

                                <input
                                    type="text"
                                    name="time"
                                    value={event.time}
                                    onChange={handleChange}
                                    placeholder="10:00 AM"
                                />

                            </div>


                        </div>


                        <div className="edit-event-grid">


                            <div className="edit-event-field">

                                <label>
                                    Venue
                                </label>

                                <input
                                    type="text"
                                    name="venue"
                                    value={event.venue}
                                    onChange={handleChange}
                                    placeholder="Enter venue"
                                    required
                                />

                            </div>


                            <div className="edit-event-field">

                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={event.city}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                    required
                                />

                            </div>


                        </div>


                    </div>


                    {/* =================================
                        TICKET DETAILS
                    ================================== */}

                    <div className="edit-event-form-section">


                        <div className="edit-event-form-title">

                            <div>
                                🎟️
                            </div>

                            <span>

                                <strong>
                                    Ticket Information
                                </strong>

                                <small>
                                    Update ticket price
                                    and event capacity.
                                </small>

                            </span>

                        </div>


                        <div className="edit-event-grid">


                            <div className="edit-event-field">

                                <label>
                                    Ticket Price (₹)
                                </label>

                                <input
                                    type="number"
                                    name="ticketPrice"
                                    value={event.ticketPrice}
                                    onChange={handleChange}
                                    placeholder="Enter ticket price"
                                    min="0"
                                    required
                                />

                            </div>


                            <div className="edit-event-field">

                                <label>
                                    Total Seats
                                </label>

                                <input
                                    type="number"
                                    name="totalSeats"
                                    value={event.totalSeats}
                                    onChange={handleChange}
                                    placeholder="Enter total seats"
                                    min="1"
                                    required
                                />

                            </div>


                        </div>


                    </div>


                    {/* =================================
                        EVENT BANNER
                    ================================== */}

                    <div className="edit-event-form-section">


                        <div className="edit-event-form-title">

                            <div>
                                🖼️
                            </div>

                            <span>

                                <strong>
                                    Event Banner
                                </strong>

                                <small>
                                    Update the image displayed
                                    for your event.
                                </small>

                            </span>

                        </div>


                        <div className="edit-event-field">

                            <label>
                                Banner URL
                            </label>

                            <input
                                type="text"
                                name="banner"
                                value={event.banner}
                                onChange={handleChange}
                                placeholder="Enter banner image URL"
                            />

                        </div>


                        {event.banner && (

                            <div className="edit-event-banner-preview">

                                <p>
                                    Banner Preview
                                </p>

                                <img
                                    src={event.banner}
                                    alt="Event Banner Preview"
                                />

                            </div>

                        )}


                    </div>


                    {/* =================================
                        ACTION BUTTONS
                    ================================== */}

                    <div className="edit-event-actions">


                        <button
                            type="button"
                            className="edit-event-cancel"
                            onClick={() =>
                                navigate(
                                    "/organizer-dashboard"
                                )
                            }
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="edit-event-submit"
                            disabled={updating}
                        >

                            {
                                updating
                                    ? "Updating Event..."
                                    : "Update Event"
                            }

                        </button>


                    </div>


                </form>


            </section>


        </div>

    );

};


export default EditEvent;