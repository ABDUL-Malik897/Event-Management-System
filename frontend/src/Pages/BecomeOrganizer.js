import React, { useState } from "react";
import API from "../api/api";
import "./BecomeOrganizer.css";
import toast from "react-hot-toast";

const BecomeOrganizer = () => {

    const [formData, setFormData] = useState({
        businessName: "",
        organizationName: "",
        phone: "",
        address: "",
        governmentId: "",
        reason: "",
    });

    const [loading, setLoading] = useState(false);


    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

    };


    // =========================
    // SUBMIT APPLICATION
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) {
            return
        }

        try {

            setLoading(true);

            const response = await API.post(
                "/organizer/apply",
                formData
            );

            toast.success(
                response.data.message ||
                "Organizer application submitted successfully"
            );

            setFormData({
                businessName: "",
                organizationName: "",
                phone: "",
                address: "",
                governmentId: "",
                reason: ""
            });

        } catch (error) {

            console.error(
                "Organizer Application Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to submit organizer application"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="become-organizer-page">


            {/* =========================
                HERO SECTION
            ========================== */}

            <section className="organizer-hero">

                <div className="organizer-hero-content">

                    <p className="organizer-hero-label">
                        CREATE • MANAGE • GROW
                    </p>

                    <h1>
                        Become an Event Organizer
                    </h1>

                    <p>

                        Turn your ideas into unforgettable
                        experiences. Apply to become an EventHub
                        organizer and start creating and managing
                        your own events.

                    </p>

                </div>


                <div className="organizer-hero-icon">
                    🎪
                </div>

            </section>


            {/* =========================
                MAIN CONTENT
            ========================== */}

            <section className="organizer-main-section">


                {/* =========================
                    LEFT INFORMATION
                ========================== */}

                <div className="organizer-info-section">

                    <p className="organizer-section-label">
                        ORGANIZER PROGRAM
                    </p>

                    <h2>
                        Start Hosting Events
                    </h2>

                    <p className="organizer-info-description">

                        Join EventHub as an organizer and get
                        access to powerful tools designed to
                        help you manage your events.

                    </p>


                    {/* BENEFITS */}

                    <div className="organizer-benefits">


                        <div className="organizer-benefit-card">

                            <div className="organizer-benefit-icon">
                                📅
                            </div>

                            <div>

                                <h3>
                                    Create Events
                                </h3>

                                <p>
                                    Create and publish events
                                    for users to discover and book.
                                </p>

                            </div>

                        </div>


                        <div className="organizer-benefit-card">

                            <div className="organizer-benefit-icon">
                                🎟️
                            </div>

                            <div>

                                <h3>
                                    Manage Bookings
                                </h3>

                                <p>
                                    Track ticket bookings and
                                    manage your event attendees.
                                </p>

                            </div>

                        </div>


                        <div className="organizer-benefit-card">

                            <div className="organizer-benefit-icon">
                                📊
                            </div>

                            <div>

                                <h3>
                                    View Analytics
                                </h3>

                                <p>
                                    Understand ticket sales,
                                    attendance and event performance.
                                </p>

                            </div>

                        </div>


                        <div className="organizer-benefit-card">

                            <div className="organizer-benefit-icon">
                                ▣
                            </div>

                            <div>

                                <h3>
                                    QR Check-In
                                </h3>

                                <p>
                                    Scan digital QR tickets for
                                    quick and secure event entry.
                                </p>

                            </div>

                        </div>


                    </div>


                    {/* APPLICATION PROCESS */}

                    <div className="organizer-process">

                        <h3>
                            What happens after applying?
                        </h3>


                        <div className="organizer-process-step">

                            <span>
                                1
                            </span>

                            <p>
                                Submit your organizer application.
                            </p>

                        </div>


                        <div className="organizer-process-step">

                            <span>
                                2
                            </span>

                            <p>
                                Our admin reviews your information.
                            </p>

                        </div>


                        <div className="organizer-process-step">

                            <span>
                                3
                            </span>

                            <p>
                                Once approved, activate your
                                organizer membership.
                            </p>

                        </div>


                        <div className="organizer-process-step">

                            <span>
                                4
                            </span>

                            <p>
                                Start creating and managing events.
                            </p>

                        </div>

                    </div>

                </div>


                {/* =========================
                    APPLICATION FORM
                ========================== */}

                <div className="organizer-form-container">

                    <div className="organizer-form-header">

                        <div className="organizer-form-icon">
                            📝
                        </div>

                        <div>

                            <p>
                                ORGANIZER APPLICATION
                            </p>

                            <h2>
                                Apply Now
                            </h2>

                        </div>

                    </div>


                    <p className="organizer-form-description">

                        Fill in your details below. Please provide
                        accurate information so your application
                        can be reviewed.

                    </p>


                    <form
                        className="organizer-form"
                        onSubmit={handleSubmit}
                    >


                        {/* BUSINESS NAME */}

                        <div className="organizer-form-group">

                            <label htmlFor="businessName">
                                Business Name
                            </label>

                            <input
                                id="businessName"
                                type="text"
                                name="businessName"
                                placeholder="Enter your business name"
                                value={formData.businessName}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* ORGANIZATION NAME */}

                        <div className="organizer-form-group">

                            <label htmlFor="organizationName">
                                Organization Name
                            </label>

                            <input
                                id="organizationName"
                                type="text"
                                name="organizationName"
                                placeholder="Enter organization name"
                                value={formData.organizationName}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* PHONE */}

                        <div className="organizer-form-group">

                            <label htmlFor="phone">
                                Phone Number
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* ADDRESS */}

                        <div className="organizer-form-group">

                            <label htmlFor="address">
                                Address
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                placeholder="Enter your complete address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="4"
                                required
                            />

                        </div>


                        {/* GOVERNMENT ID */}

                        <div className="organizer-form-group">

                            <label htmlFor="governmentId">
                                Government ID
                            </label>

                            <input
                                id="governmentId"
                                type="text"
                                name="governmentId"
                                placeholder="Enter your government ID"
                                value={formData.governmentId}
                                onChange={handleChange}
                                required
                            />

                            <small>
                                Your information is used only for
                                organizer verification.
                            </small>

                        </div>


                        {/* REASON */}

                        <div className="organizer-form-group">

                            <label htmlFor="reason">
                                Why do you want to become an organizer?
                            </label>

                            <textarea
                                id="reason"
                                name="reason"
                                placeholder="Tell us about the events you plan to organize..."
                                value={formData.reason}
                                onChange={handleChange}
                                rows="5"
                                required
                            />

                        </div>


                        {/* SUBMIT BUTTON */}

                        <button
                            className="organizer-submit-button"
                            type="submit"
                            disabled={loading}
                        >

                            {
                                loading
                                    ? (
                                        <>
                                            <span className="organizer-button-loader">
                                            </span>

                                            Submitting Application...
                                        </>
                                    )
                                    : (
                                        <>
                                            Submit Application
                                            <span>
                                                →
                                            </span>
                                        </>
                                    )
                            }

                        </button>


                        <p className="organizer-form-note">

                            By submitting this application,
                            you confirm that the information
                            provided is accurate.

                        </p>


                    </form>

                </div>


            </section>

        </div>

    );

};

export default BecomeOrganizer;