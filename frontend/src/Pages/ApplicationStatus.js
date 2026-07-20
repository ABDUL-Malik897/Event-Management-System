import React, { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";
import "./ApplicationStatus.css";

const ApplicationStatus = () => {

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);


    // =========================
    // FETCH APPLICATION STATUS
    // =========================

    useEffect(() => {

        const fetchStatus = async () => {

            try {

                const response = await API.get(
                    "/organizer/status"
                );

                setRequest(
                    response.data.request
                );

            } catch (error) {

                console.error(
                    "Application Status Error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load application status"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchStatus();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="application-status-loading">

                <div className="application-status-loader">
                </div>

                <h2>
                    Checking your application...
                </h2>

                <p>
                    Please wait while we fetch your
                    organizer application status.
                </p>

            </div>

        );

    }


    // =========================
    // NO APPLICATION
    // =========================

    if (!request) {

        return (

            <div className="application-status-page">

                <section className="application-status-hero">

                    <div className="application-status-hero-content">

                        <p className="application-status-hero-label">
                            ORGANIZER PROGRAM
                        </p>

                        <h1>
                            Application Status
                        </h1>

                        <p>
                            Track your organizer application
                            and stay updated on its review status.
                        </p>

                    </div>


                    <div className="application-status-hero-icon">
                        📋
                    </div>

                </section>


                <section className="application-empty-section">

                    <div className="application-empty-card">

                        <div className="application-empty-icon">
                            📭
                        </div>

                        <h2>
                            No Organizer Application Found
                        </h2>

                        <p>

                            You haven't submitted an organizer
                            application yet. Once you apply,
                            you'll be able to track your
                            application status here.

                        </p>

                    </div>

                </section>

            </div>

        );

    }


    // =========================
    // STATUS HELPERS
    // =========================

    const status =
        request.status?.toLowerCase() ||
        "pending";


    const getStatusIcon = () => {

        if (status === "approved") {
            return "✓";
        }

        if (status === "rejected") {
            return "✕";
        }

        return "⏳";

    };


    const getStatusTitle = () => {

        if (status === "approved") {
            return "Application Approved!";
        }

        if (status === "rejected") {
            return "Application Rejected";
        }

        return "Application Under Review";

    };


    const getStatusMessage = () => {

        if (status === "approved") {

            return "Congratulations! Your organizer application has been approved. You can now proceed with the next steps to activate your organizer account.";

        }

        if (status === "rejected") {

            return "Unfortunately, your organizer application was not approved. Please review the admin remarks below for more information.";

        }

        return "Your organizer application has been submitted successfully and is currently being reviewed by our admin team.";

    };


    return (

        <div className="application-status-page">


            {/* =========================
                HERO
            ========================== */}

            <section className="application-status-hero">

                <div className="application-status-hero-content">

                    <p className="application-status-hero-label">
                        ORGANIZER PROGRAM
                    </p>

                    <h1>
                        Application Status
                    </h1>

                    <p>

                        Track your organizer application
                        and stay updated throughout the
                        approval process.

                    </p>

                </div>


                <div className="application-status-hero-icon">
                    📋
                </div>

            </section>


            {/* =========================
                MAIN SECTION
            ========================== */}

            <section className="application-status-main">


                {/* =========================
                    STATUS CARD
                ========================== */}

                <div
                    className={`application-status-banner application-status-${status}`}
                >

                    <div className="application-status-banner-icon">

                        {getStatusIcon()}

                    </div>


                    <div className="application-status-banner-content">

                        <p>
                            CURRENT STATUS
                        </p>

                        <h2>
                            {getStatusTitle()}
                        </h2>

                        <span>
                            {getStatusMessage()}
                        </span>

                    </div>


                    <div className="application-status-badge">

                        {request.status}

                    </div>

                </div>


                {/* =========================
                    APPLICATION DETAILS
                ========================== */}

                <div className="application-details-card">


                    <div className="application-details-header">

                        <div>

                            <p className="application-details-label">
                                APPLICATION DETAILS
                            </p>

                            <h2>
                                Organizer Information
                            </h2>

                        </div>


                        <div className="application-details-icon">
                            📝
                        </div>

                    </div>


                    {/* DETAILS GRID */}

                    <div className="application-details-grid">


                        {/* BUSINESS NAME */}

                        <div className="application-detail-item">

                            <div className="application-detail-icon">
                                💼
                            </div>

                            <div>

                                <span>
                                    Business Name
                                </span>

                                <strong>
                                    {request.businessName || "N/A"}
                                </strong>

                            </div>

                        </div>


                        {/* ORGANIZATION */}

                        <div className="application-detail-item">

                            <div className="application-detail-icon">
                                🏢
                            </div>

                            <div>

                                <span>
                                    Organization
                                </span>

                                <strong>
                                    {
                                        request.organizationName ||
                                        "N/A"
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* PHONE */}

                        <div className="application-detail-item">

                            <div className="application-detail-icon">
                                📞
                            </div>

                            <div>

                                <span>
                                    Phone Number
                                </span>

                                <strong>
                                    {request.phone || "N/A"}
                                </strong>

                            </div>

                        </div>


                        {/* APPLIED ON */}

                        <div className="application-detail-item">

                            <div className="application-detail-icon">
                                📅
                            </div>

                            <div>

                                <span>
                                    Applied On
                                </span>

                                <strong>

                                    {
                                        request.createdAt
                                            ? new Date(
                                                request.createdAt
                                            ).toLocaleDateString()
                                            : "N/A"
                                    }

                                </strong>

                            </div>

                        </div>


                    </div>


                    {/* =========================
                        ADDRESS
                    ========================== */}

                    <div className="application-full-detail">

                        <span>
                            Address
                        </span>

                        <p>
                            {request.address || "N/A"}
                        </p>

                    </div>


                    {/* =========================
                        GOVERNMENT ID
                    ========================== */}

                    <div className="application-full-detail">

                        <span>
                            Government ID
                        </span>

                        <p>
                            {
                                request.governmentId ||
                                "N/A"
                            }
                        </p>

                    </div>


                    {/* =========================
                        REASON
                    ========================== */}

                    <div className="application-full-detail">

                        <span>
                            Reason for Becoming an Organizer
                        </span>

                        <p>
                            {request.reason || "N/A"}
                        </p>

                    </div>


                </div>


                {/* =========================
                    ADMIN REMARK
                ========================== */}

                <div
                    className={`application-admin-card application-admin-${status}`}
                >

                    <div className="application-admin-icon">
                        💬
                    </div>


                    <div>

                        <p className="application-admin-label">
                            ADMIN REMARK
                        </p>

                        <h3>
                            Message from EventHub
                        </h3>

                        <p className="application-admin-message">

                            {
                                request.adminRemark ||
                                (
                                    status === "pending"
                                        ? "Your application is currently under review. No remarks have been added by the admin yet."
                                        : "No remarks provided."
                                )
                            }

                        </p>

                    </div>

                </div>


                {/* =========================
                    PENDING INFO
                ========================== */}

                {status === "pending" && (

                    <div className="application-review-info">

                        <div className="application-review-icon">
                            ⏳
                        </div>

                        <div>

                            <h3>
                                What happens next?
                            </h3>

                            <p>

                                Your application is being reviewed
                                by our admin team. Once a decision
                                is made, your status will be updated
                                here.

                            </p>

                        </div>

                    </div>

                )}


                {/* =========================
                    APPROVED INFO
                ========================== */}

                {status === "approved" && (

                    <div className="application-approved-info">

                        <div className="application-review-icon">
                            🎉
                        </div>

                        <div>

                            <h3>
                                You're Approved!
                            </h3>

                            <p>

                                Your organizer application has
                                been approved. You can now proceed
                                with the required organizer
                                membership activation.

                            </p>

                        </div>

                    </div>

                )}


            </section>

        </div>

    );

};

export default ApplicationStatus;