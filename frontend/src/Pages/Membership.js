import React, {
    useEffect,
    useState
} from "react";

import toast from "react-hot-toast";

import {
    useNavigate
} from "react-router-dom";

import API from "../api/api";

import useAuthContext
    from "../hooks/useAuthContext";

import "./Membership.css";


const Membership = () => {

    const navigate =
        useNavigate();

    const { dispatch } =
        useAuthContext();


    const [loading, setLoading] =
        useState(true);

    const [paymentLoading, setPaymentLoading] =
        useState(false);

    const [selectedPlan, setSelectedPlan] =
        useState(null);

    const [hasMembership, setHasMembership] =
        useState(false);

    const [membership, setMembership] =
        useState(null);

    const [events, setEvents] =
        useState([]);


    // ==========================================
    // FETCH CURRENT MEMBERSHIP
    // ==========================================

    const fetchMembership =
        async () => {

            try {

                const response =
                    await API.get(
                        "/membership-payment/current"
                    );


                setHasMembership(
                    response.data.hasMembership
                );


                setMembership(
                    response.data.membership
                );


                setEvents(
                    response.data.events || []
                );


            } catch (error) {

                console.error(
                    "Membership Error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load membership"
                );


            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        fetchMembership();

    }, []);


    // ==========================================
    // LOAD RAZORPAY SCRIPT
    // ==========================================

    const loadRazorpayScript = () => {

        return new Promise(
            (resolve) => {

                if (window.Razorpay) {

                    resolve(true);

                    return;

                }


                const script =
                    document.createElement(
                        "script"
                    );


                script.src =
                    "https://checkout.razorpay.com/v1/checkout.js";


                script.onload =
                    () => resolve(true);


                script.onerror =
                    () => resolve(false);


                document.body.appendChild(
                    script
                );

            }
        );

    };


    // ==========================================
    // PURCHASE / RENEW MEMBERSHIP
    // ==========================================

    const activateMembership =
        async (plan) => {

            try {

                setPaymentLoading(true);

                setSelectedPlan(plan);


                const loaded =
                    await loadRazorpayScript();


                if (!loaded) {

                    toast.error(
                        "Razorpay failed to load."
                    );

                    return;

                }


                // CREATE ORDER

                const response =
                    await API.post(

                        "/membership-payment/create-order",

                        {
                            plan
                        }

                    );


                const {
                    order,
                    key,
                    plan: planDetails
                } = response.data;


                const options = {

                    key,

                    amount:
                        order.amount,

                    currency:
                        order.currency,

                    name:
                        "EventHub",

                    description:
                        `${planDetails.name} Organizer Membership`,

                    order_id:
                        order.id,


                    // ==================================
                    // PAYMENT SUCCESS
                    // ==================================

                    handler:
                        async function (
                            paymentResponse
                        ) {

                            try {

                                const verifyResponse =
                                    await API.post(

                                        "/membership-payment/verify",

                                        {

                                            razorpay_order_id:
                                                paymentResponse
                                                    .razorpay_order_id,

                                            razorpay_payment_id:
                                                paymentResponse
                                                    .razorpay_payment_id,

                                            razorpay_signature:
                                                paymentResponse
                                                    .razorpay_signature

                                        }

                                    );


                                if (
                                    verifyResponse
                                        .data
                                        .success
                                ) {

                                    const auth =
                                        JSON.parse(

                                            localStorage
                                                .getItem(
                                                    "user"
                                                )

                                        );


                                    if (auth) {

                                        const updatedAuth = {

                                            ...auth,

                                            membershipStatus:
                                                verifyResponse
                                                    .data
                                                    .membership
                                                    .status,

                                            membershipExpiry:
                                                verifyResponse
                                                    .data
                                                    .membership
                                                    .expiryDate

                                        };


                                        localStorage.setItem(

                                            "user",

                                            JSON.stringify(
                                                updatedAuth
                                            )

                                        );


                                        dispatch({

                                            type:
                                                "LOGIN",

                                            payload:
                                                updatedAuth

                                        });

                                    }


                                    toast.success(
                                        "Membership activated successfully!"
                                    );


                                    // Refresh membership page data

                                    await fetchMembership();

                                }


                            } catch (error) {

                                console.error(
                                    "Membership Payment Verification Error:",
                                    error
                                );

                                toast.error(
                                    error.response?.data?.message ||
                                    "Payment verification failed"
                                );

                            }

                        },


                    theme: {

                        color:
                            "#6c5ce7"

                    }

                };


                const paymentObject =
                    new window.Razorpay(
                        options
                    );


                paymentObject.on(
                    "payment.failed",
                    function (response) {

                        console.error(
                            "Membership Payment Failed:",
                            response.error
                        );

                        toast.error(
                            response.error?.description ||
                            "Payment failed. Please try again."
                        );

                    }
                );


                paymentObject.open();


            } catch (error) {

                console.error(
                    "Membership Payment Error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to start payment"
                );

            } finally {

                setPaymentLoading(false);

                setSelectedPlan(null);

            }

        };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="membership-loading">

                Loading membership...

            </div>

        );

    }


    return (

        <div className="membership-page">


            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="membership-header">

                <span className="membership-badge">

                    EVENTHUB ORGANIZER

                </span>


                <h1>

                    Organizer Membership

                </h1>


                <p>

                    Manage your EventHub membership
                    and view your membership activity.

                </p>


                <button

                    className="membership-history-link"

                    onClick={() =>

                        navigate(
                            "/membership-history"
                        )

                    }

                >

                    View Membership Payment History

                </button>

            </div>


            {/* ================================= */}
            {/* ACTIVE MEMBERSHIP */}
            {/* ================================= */}

            {

                hasMembership &&
                membership

                    ? (

                        <>


                            <div className="active-membership-card">


                                <div className="active-membership-top">


                                    <div>

                                        <span className="active-membership-badge">

                                            ACTIVE MEMBERSHIP

                                        </span>


                                        <h2>

                                            {
                                                membership.plan
                                            } Membership

                                        </h2>

                                    </div>


                                    <div className="membership-days-left">

                                        <strong>

                                            {
                                                membership.daysLeft
                                            }

                                        </strong>

                                        <span>

                                            Days Left

                                        </span>

                                    </div>


                                </div>


                                <div className="membership-details-grid">


                                    <div>

                                        <span>
                                            Plan
                                        </span>

                                        <strong>

                                            {
                                                membership.plan ||
                                                "-"
                                            }

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Amount Paid
                                        </span>

                                        <strong>

                                            ₹{
                                                membership.amount ||
                                                "-"
                                            }

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Started On
                                        </span>

                                        <strong>

                                            {
                                                formatDate(
                                                    membership.startDate
                                                )
                                            }

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Expires On
                                        </span>

                                        <strong>

                                            {
                                                formatDate(
                                                    membership.expiryDate
                                                )
                                            }

                                        </strong>

                                    </div>


                                </div>


                                <div className="membership-payment-id">

                                    <span>

                                        Payment ID

                                    </span>

                                    <p>

                                        {
                                            membership.paymentId ||
                                            "-"
                                        }

                                    </p>

                                </div>


                            </div>


                            {/* ============================= */}
                            {/* EVENTS CREATED */}
                            {/* ============================= */}

                            <div className="membership-events-section">


                                <div className="membership-section-header">

                                    <div>

                                        <h2>

                                            Events Created During Membership

                                        </h2>

                                        <p>

                                            {
                                                events.length
                                            } event(s) created during
                                            your current membership.

                                        </p>

                                    </div>


                                    <button

                                        onClick={() =>

                                            navigate(
                                                "/create-event"
                                            )

                                        }

                                    >

                                        + Create Event

                                    </button>

                                </div>


                                {

                                    events.length === 0

                                        ? (

                                            <div className="membership-no-events">

                                                <h3>

                                                    No Events Created Yet

                                                </h3>

                                                <p>

                                                    Start creating events
                                                    with your active membership.

                                                </p>

                                            </div>

                                        )

                                        : (

                                            <div className="membership-event-grid">


                                                {

                                                    events.map(
                                                        (event) => (

                                                            <div

                                                                className="membership-event-card"

                                                                key={
                                                                    event._id
                                                                }

                                                            >


                                                                <h3>

                                                                    {
                                                                        event.title
                                                                    }

                                                                </h3>


                                                                <p>

                                                                    📅 {

                                                                        formatDate(
                                                                            event.date
                                                                        )

                                                                    }

                                                                </p>


                                                                <p>

                                                                    📍 {

                                                                        event.venue

                                                                    }, {

                                                                        event.city

                                                                    }

                                                                </p>


                                                            </div>

                                                        )
                                                    )

                                                }


                                            </div>

                                        )

                                }


                            </div>


                            {/* ============================= */}
                            {/* RENEW / EXTEND */}
                            {/* ============================= */}

                            <div className="membership-renew-section">

                                <h2>

                                    Extend Your Membership

                                </h2>


                                <p>

                                    Purchase another plan now and
                                    the duration will be added after
                                    your current membership expires.

                                </p>


                                <div className="membership-renew-buttons">


                                    <button

                                        disabled={
                                            paymentLoading
                                        }

                                        onClick={() =>

                                            activateMembership(
                                                "Monthly"
                                            )

                                        }

                                    >

                                        {

                                            paymentLoading &&
                                            selectedPlan ===
                                                "Monthly"

                                                ? "Processing..."

                                                : "Add 30 Days — ₹299"

                                        }

                                    </button>


                                    <button

                                        disabled={
                                            paymentLoading
                                        }

                                        onClick={() =>

                                            activateMembership(
                                                "Yearly"
                                            )

                                        }

                                    >

                                        {

                                            paymentLoading &&
                                            selectedPlan ===
                                                "Yearly"

                                                ? "Processing..."

                                                : "Add 365 Days — ₹1999"

                                        }

                                    </button>


                                </div>


                            </div>


                        </>

                    )

                    : (

                        // =================================
                        // NO ACTIVE MEMBERSHIP
                        // =================================

                        <div className="membership-plans">


                            {/* MONTHLY */}

                            <div className="membership-card">


                                <span className="membership-plan-label">

                                    MONTHLY

                                </span>


                                <h2>

                                    Monthly Plan

                                </h2>


                                <div className="membership-price">

                                    <span>
                                        ₹
                                    </span>

                                    <strong>
                                        299
                                    </strong>

                                    <small>
                                        / month
                                    </small>

                                </div>


                                <p>

                                    Valid for 30 Days

                                </p>


                                <ul className="membership-features">

                                    <li>
                                        ✓ Create Events
                                    </li>

                                    <li>
                                        ✓ Manage Attendees
                                    </li>

                                    <li>
                                        ✓ QR Ticket Scanner
                                    </li>

                                    <li>
                                        ✓ Event Analytics
                                    </li>

                                </ul>


                                <button

                                    className="membership-button"

                                    disabled={
                                        paymentLoading
                                    }

                                    onClick={() =>

                                        activateMembership(
                                            "Monthly"
                                        )

                                    }

                                >

                                    {

                                        paymentLoading &&
                                        selectedPlan ===
                                            "Monthly"

                                            ? "Processing..."

                                            : "Choose Monthly"

                                    }

                                </button>


                            </div>


                            {/* YEARLY */}

                            <div className="membership-card membership-card-popular">


                                <div className="membership-popular">

                                    BEST VALUE

                                </div>


                                <span className="membership-plan-label">

                                    YEARLY

                                </span>


                                <h2>

                                    Yearly Plan

                                </h2>


                                <div className="membership-price">

                                    <span>
                                        ₹
                                    </span>

                                    <strong>
                                        1999
                                    </strong>

                                    <small>
                                        / year
                                    </small>

                                </div>


                                <p>

                                    Valid for 365 Days

                                </p>


                                <ul className="membership-features">

                                    <li>
                                        ✓ Create Events
                                    </li>

                                    <li>
                                        ✓ Manage Attendees
                                    </li>

                                    <li>
                                        ✓ QR Ticket Scanner
                                    </li>

                                    <li>
                                        ✓ Event Analytics
                                    </li>

                                </ul>


                                <button

                                    className="membership-button"

                                    disabled={
                                        paymentLoading
                                    }

                                    onClick={() =>

                                        activateMembership(
                                            "Yearly"
                                        )

                                    }

                                >

                                    {

                                        paymentLoading &&
                                        selectedPlan ===
                                            "Yearly"

                                            ? "Processing..."

                                            : "Choose Yearly"

                                    }

                                </button>


                            </div>


                        </div>

                    )

            }


            <button

                className="membership-back-button"

                onClick={() =>

                    navigate(
                        "/organizer-dashboard"
                    )

                }

            >

                ← Back to Dashboard

            </button>


        </div>

    );

};


export default Membership;