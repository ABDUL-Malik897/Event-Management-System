import React, {
    useEffect,
    useState
} from "react";

import toast from "react-hot-toast";

import API from "../api/api";

import "./AdminReqs.css";


const AdminReqs = () => {

    const [requests, setRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [processingId, setProcessingId] =
        useState(null);


    // =========================================
    // FETCH PENDING REQUESTS
    // =========================================

    const fetchReqs = async () => {

        try {

            const response =
                await API.get(
                    "/organizer/pending"
                );


            setRequests(
                response.data.requests || []
            );


        } catch (error) {

            console.error(
                "Fetch Organizer Requests Error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Failed to load organizer requests"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchReqs();

    }, []);


    // =========================================
    // APPROVE ORGANIZER
    // =========================================

    const approve = async (id) => {

        const confirmApprove =
            window.confirm(
                "Are you sure you want to approve this organizer?"
            );


        if (!confirmApprove) {
            return;
        }


        try {

            setProcessingId(id);


            const response =
                await API.put(
                    `/organizer/${id}/approve`
                );


            toast.success(
                response.data.message ||
                "Organizer approved successfully"
            );


            setRequests(
                (previousRequests) =>
                    previousRequests.filter(
                        request =>
                            request._id !== id
                    )
            );


        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to approve organizer"
            );


        } finally {

            setProcessingId(null);

        }

    };


    // =========================================
    // REJECT ORGANIZER
    // =========================================

    const reject = async (id) => {

        const confirmReject =
            window.confirm(
                "Are you sure you want to reject this organizer application?"
            );


        if (!confirmReject) {
            return;
        }


        try {

            setProcessingId(id);


            const response =
                await API.put(
                    `/organizer/${id}/reject`
                );


            toast.success(
                response.data.message ||
                "Organizer application rejected"
            );


            setRequests(
                (previousRequests) =>
                    previousRequests.filter(
                        request =>
                            request._id !== id
                    )
            );


        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to reject organizer"
            );


        } finally {

            setProcessingId(null);

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="admin-reqs-loading">

                <div className="admin-reqs-spinner">
                </div>

                <h2>
                    Loading Organizer Requests...
                </h2>

                <p>
                    Please wait while we fetch
                    pending applications.
                </p>

            </div>

        );

    }


    return (

        <div className="admin-reqs-page">


            {/* =====================================
                PAGE HEADER
            ====================================== */}

            <section className="admin-reqs-header">

                <div>

                    <span className="admin-reqs-label">
                        ADMINISTRATION
                    </span>

                    <h1>
                        Organizer Requests
                    </h1>

                    <p>
                        Review applications from users
                        who want to become organizers
                        on EventHub.
                    </p>

                </div>


                <div className="admin-reqs-count">

                    <span>
                        Pending Requests
                    </span>

                    <strong>
                        {requests.length}
                    </strong>

                </div>

            </section>


            {/* =====================================
                EMPTY STATE
            ====================================== */}

            {
                requests.length === 0
                    ? (

                        <div className="admin-reqs-empty">

                            <div className="admin-empty-icon">
                                🎉
                            </div>

                            <h2>
                                No Pending Requests
                            </h2>

                            <p>
                                You're all caught up!
                                There are currently no
                                organizer applications
                                waiting for review.
                            </p>

                        </div>

                    )
                    : (

                        <div className="admin-reqs-list">

                            {
                                requests.map(
                                    (request, index) => (

                                        <div
                                            key={request._id}
                                            className="admin-request-card"
                                        >


                                            {/* CARD HEADER */}

                                            <div className="admin-request-header">


                                                <div className="admin-request-user">


                                                    <div className="admin-user-avatar">

                                                        {
                                                            request.user
                                                                ?.username
                                                                ?.charAt(0)
                                                                .toUpperCase() ||
                                                            "U"
                                                        }

                                                    </div>


                                                    <div>

                                                        <span className="admin-request-number">

                                                            APPLICATION #
                                                            {index + 1}

                                                        </span>


                                                        <h2>

                                                            {
                                                                request.user
                                                                    ?.username ||
                                                                "Unknown User"
                                                            }

                                                        </h2>


                                                        <p>

                                                            {
                                                                request.user
                                                                    ?.email ||
                                                                "Email not available"
                                                            }

                                                        </p>

                                                    </div>


                                                </div>


                                                <span className="admin-pending-badge">

                                                    Pending Review

                                                </span>


                                            </div>


                                            {/* BUSINESS INFORMATION */}

                                            <div className="admin-request-section">


                                                <h3>
                                                    Business Information
                                                </h3>


                                                <div className="admin-request-grid">


                                                    <div className="admin-request-info">

                                                        <span>
                                                            Business Name
                                                        </span>

                                                        <strong>

                                                            {
                                                                request.businessName ||
                                                                "Not Provided"
                                                            }

                                                        </strong>

                                                    </div>


                                                    <div className="admin-request-info">

                                                        <span>
                                                            Organization
                                                        </span>

                                                        <strong>

                                                            {
                                                                request.organizationName ||
                                                                "Not Provided"
                                                            }

                                                        </strong>

                                                    </div>


                                                    <div className="admin-request-info">

                                                        <span>
                                                            Phone Number
                                                        </span>

                                                        <strong>

                                                            {
                                                                request.phone ||
                                                                "Not Provided"
                                                            }

                                                        </strong>

                                                    </div>


                                                    <div className="admin-request-info">

                                                        <span>
                                                            Government ID
                                                        </span>

                                                        <strong>

                                                            {
                                                                request.governmentId ||
                                                                "Not Provided"
                                                            }

                                                        </strong>

                                                    </div>


                                                </div>


                                            </div>


                                            {/* ADDRESS */}

                                            <div className="admin-request-section">

                                                <h3>
                                                    Address
                                                </h3>


                                                <div className="admin-request-text">

                                                    📍{" "}

                                                    {
                                                        request.address ||
                                                        "Address not provided"
                                                    }

                                                </div>


                                            </div>


                                            {/* REASON */}

                                            <div className="admin-request-section">


                                                <h3>
                                                    Why do they want to
                                                    become an organizer?
                                                </h3>


                                                <div className="admin-request-reason">

                                                    <span>
                                                        “
                                                    </span>

                                                    <p>

                                                        {
                                                            request.reason ||
                                                            "No reason provided"
                                                        }

                                                    </p>


                                                </div>


                                            </div>


                                            {/* ACTION BUTTONS */}

                                            <div className="admin-request-actions">


                                                <button
                                                    type="button"
                                                    className="admin-approve-btn"
                                                    disabled={
                                                        processingId ===
                                                        request._id
                                                    }
                                                    onClick={() =>
                                                        approve(
                                                            request._id
                                                        )
                                                    }
                                                >

                                                    {
                                                        processingId ===
                                                        request._id
                                                            ? "Processing..."
                                                            : "✓ Approve Organizer"
                                                    }

                                                </button>


                                                <button
                                                    type="button"
                                                    className="admin-reject-btn"
                                                    disabled={
                                                        processingId ===
                                                        request._id
                                                    }
                                                    onClick={() =>
                                                        reject(
                                                            request._id
                                                        )
                                                    }
                                                >

                                                    {
                                                        processingId ===
                                                        request._id
                                                            ? "Processing..."
                                                            : "✕ Reject Application"
                                                    }

                                                </button>


                                            </div>


                                        </div>

                                    )
                                )
                            }


                        </div>

                    )
            }


        </div>

    );

};


export default AdminReqs;