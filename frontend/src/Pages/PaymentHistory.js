import React, { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";
import "./PaymentHistory.css";

const PaymentHistory = () => {

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);


    // =========================
    // FETCH PAYMENT HISTORY
    // =========================

    useEffect(() => {

        const fetchPayments = async () => {

            try {

                const response = await API.get(
                    "/payment/my"
                );

                setPayments(
                    response.data.payments || []
                );

            } catch (error) {

                console.error(
                    "Payment History Error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load payment history"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchPayments();

    }, []);


    // =========================
    // PAYMENT COUNTS
    // =========================

    const successfulPayments = payments.filter(
        (payment) =>
            payment.status === "Paid" ||
            payment.status === "Success"
    ).length;


    const failedPayments = payments.filter(
        (payment) =>
            payment.status === "Failed"
    ).length;


    const totalSpent = payments
        .filter(
            (payment) =>
                payment.status === "Paid" ||
                payment.status === "Success"
        )
        .reduce(
            (total, payment) =>
                total + Number(payment.amount || 0),
            0
        );


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="payment-history-loading">

                <div className="payment-history-loader">
                </div>

                <h2>
                    Loading payment history...
                </h2>

                <p>
                    We're getting your payment records ready.
                </p>

            </div>

        );

    }


    return (

        <div className="payment-history-page">


            {/* =========================
                HERO SECTION
            ========================== */}

            <section className="payment-history-hero">

                <div className="payment-history-hero-content">

                    <p className="payment-history-hero-label">
                        SECURE • SIMPLE • TRANSPARENT
                    </p>

                    <h1>
                        Payment History
                    </h1>

                    <p>

                        View all your EventHub transactions,
                        track successful payments and review
                        your complete payment activity.

                    </p>

                </div>


                <div className="payment-history-hero-icon">
                    💳
                </div>

            </section>


            {/* =========================
                MAIN CONTENT
            ========================== */}

            <section className="payment-history-section">


                {/* =========================
                    HEADER
                ========================== */}

                <div className="payment-history-header">

                    <div>

                        <p className="payment-history-label">
                            TRANSACTION HISTORY
                        </p>

                        <h2>
                            Your Payments
                        </h2>

                        <p>

                            Review payments made for your
                            event bookings on EventHub.

                        </p>

                    </div>

                </div>


                {/* =========================
                    PAYMENT STATS
                ========================== */}

                {payments.length > 0 && (

                    <div className="payment-history-stats">


                        {/* TOTAL TRANSACTIONS */}

                        <div className="payment-stat-card">

                            <div className="payment-stat-icon">
                                💳
                            </div>

                            <div>

                                <span>
                                    Transactions
                                </span>

                                <strong>
                                    {payments.length}
                                </strong>

                            </div>

                        </div>


                        {/* SUCCESSFUL */}

                        <div className="payment-stat-card payment-stat-success">

                            <div className="payment-stat-icon">
                                ✓
                            </div>

                            <div>

                                <span>
                                    Successful
                                </span>

                                <strong>
                                    {successfulPayments}
                                </strong>

                            </div>

                        </div>


                        {/* FAILED */}

                        <div className="payment-stat-card payment-stat-failed">

                            <div className="payment-stat-icon">
                                ✕
                            </div>

                            <div>

                                <span>
                                    Failed
                                </span>

                                <strong>
                                    {failedPayments}
                                </strong>

                            </div>

                        </div>


                        {/* TOTAL SPENT */}

                        <div className="payment-stat-card payment-stat-spent">

                            <div className="payment-stat-icon">
                                ₹
                            </div>

                            <div>

                                <span>
                                    Total Spent
                                </span>

                                <strong>
                                    ₹{totalSpent}
                                </strong>

                            </div>

                        </div>


                    </div>

                )}


                {/* =========================
                    EMPTY STATE
                ========================== */}

                {payments.length === 0 ? (

                    <div className="payment-history-empty">

                        <div className="payment-history-empty-icon">
                            💳
                        </div>

                        <h2>
                            No Payment History Found
                        </h2>

                        <p>

                            You haven't made any payments yet.
                            Once you book an event, your payment
                            transactions will appear here.

                        </p>

                    </div>

                ) : (


                    /* =========================
                        PAYMENT LIST
                    ========================== */

                    <div className="payment-history-list">

                        {payments.map((payment) => (

                            <div
                                key={payment._id}
                                className="payment-history-card"
                            >


                                {/* =========================
                                    CARD HEADER
                                ========================== */}

                                <div className="payment-card-header">


                                    <div className="payment-event-info">

                                        <div className="payment-event-icon">
                                            🎟️
                                        </div>


                                        <div>

                                            <p className="payment-event-label">
                                                EVENT PAYMENT
                                            </p>

                                            <h2>

                                                {
                                                    payment.event?.title ||
                                                    "Event"
                                                }

                                            </h2>

                                        </div>

                                    </div>


                                    {/* PAYMENT STATUS */}

                                    <span
                                        className={`payment-status-badge payment-status-${
                                            payment.status?.toLowerCase() || "pending"
                                        }`}
                                    >
                                        {
                                            payment.status === "Paid" ||
                                            payment.status === "Success"
                                                ? "✓ "
                                                : payment.status === "Failed"
                                                ? "✕ "
                                                : "● "
                                        }

                                        <strong>
                                            {payment.status || "Pending"}
                                        </strong>
                                    </span>


                                </div>


                                {/* =========================
                                    PAYMENT INFORMATION
                                ========================== */}

                                <div className="payment-card-details">


                                    {/* AMOUNT */}

                                    <div className="payment-detail-item">

                                        <span>
                                            Amount
                                        </span>

                                        <strong className="payment-amount">

                                            ₹{payment.amount}

                                        </strong>

                                    </div>


                                    {/* QUANTITY */}

                                    <div className="payment-detail-item">

                                        <span>
                                            Tickets
                                        </span>

                                        <strong>

                                            {
                                                payment.quantity ||
                                                0
                                            }

                                        </strong>

                                    </div>


                                    {/* STATUS */}

                                    <div className="payment-detail-item">

                                        <span>
                                            Payment Status
                                        </span>

                                        <strong>

                                            {payment.status}

                                        </strong>

                                    </div>


                                    {/* DATE */}

                                    <div className="payment-detail-item">

                                        <span>
                                            Transaction Date
                                        </span>

                                        <strong>

                                            {
                                                payment.createdAt
                                                    ? new Date(
                                                        payment.createdAt
                                                    ).toLocaleString()
                                                    : "N/A"
                                            }

                                        </strong>

                                    </div>


                                </div>


                                {/* =========================
                                    TRANSACTION IDS
                                ========================== */}

                                <div className="payment-transaction-section">

                                    <p className="payment-transaction-label">
                                        TRANSACTION DETAILS
                                    </p>


                                    <div className="payment-transaction-grid">


                                        {/* ORDER ID */}

                                        <div className="payment-transaction-item">

                                            <span>
                                                Razorpay Order ID
                                            </span>

                                            <p title={payment.razorpayOrderId}>

                                                {
                                                    payment.razorpayOrderId ||
                                                    "Not Available"
                                                }

                                            </p>

                                        </div>


                                        {/* PAYMENT ID */}

                                        <div className="payment-transaction-item">

                                            <span>
                                                Razorpay Payment ID
                                            </span>

                                            <p title={payment.razorpayPaymentId}>

                                                {
                                                    payment.razorpayPaymentId ||
                                                    "Not Available"
                                                }

                                            </p>

                                        </div>


                                    </div>


                                    {/* =========================
                                        FAILURE REASON
                                    ========================== */}

                                    {
                                        payment.status === "Failed" &&
                                        payment.failureReason && (

                                            <div className="payment-failure-box">

                                                <span>
                                                    ⚠️
                                                </span>

                                                <div>

                                                    <strong>
                                                        Payment Failed
                                                    </strong>

                                                    <p>
                                                        {
                                                            payment.failureReason
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    }


                                </div>


                            </div>

                        ))}

                    </div>

                )}


            </section>

        </div>

    );

};

export default PaymentHistory;