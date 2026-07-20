import React, {
    useEffect,
    useState
} from "react";

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

import API from "../api/api";

import "./MembershipHistory.css";


const MembershipHistory = () => {

    const navigate =
        useNavigate();


    const [payments, setPayments] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // FETCH MEMBERSHIP PAYMENT HISTORY
    // ==========================================

    const fetchPaymentHistory =
        async () => {

            try {

                const response =
                    await API.get(
                        "/membership-payment/history"
                    );


                setPayments(
                    response.data.payments || []
                );


            } catch (error) {

                console.error(
                    "Membership History Error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load membership payment history"
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        fetchPaymentHistory();

    }, []);


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
                month: "short",
                year: "numeric"
            }
        );

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="membership-history-loading">

                Loading membership history...

            </div>

        );

    }


    return (

        <div className="membership-history-page">


            <div className="membership-history-header">

                <span>

                    EVENTHUB ORGANIZER

                </span>


                <h1>

                    Membership History

                </h1>


                <p>

                    View your previous organizer
                    membership purchases and payment
                    details.

                </p>

            </div>


            {/* ================================= */}
            {/* NO PAYMENTS */}
            {/* ================================= */}

            {

                payments.length === 0

                    ? (

                        <div className="membership-history-empty">

                            <h2>

                                No Membership Payments

                            </h2>


                            <p>

                                You haven't purchased
                                an organizer membership yet.

                            </p>


                            <button

                                onClick={() =>
                                    navigate(
                                        "/membership"
                                    )
                                }

                            >

                                View Membership Plans

                            </button>

                        </div>

                    )

                    : (

                        // =================================
                        // PAYMENT TABLE
                        // =================================

                        <div className="membership-history-table-container">


                            <table className="membership-history-table">


                                <thead>

                                    <tr>

                                        <th>
                                            Plan
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Payment ID
                                        </th>

                                        <th>
                                            Paid On
                                        </th>

                                        <th>
                                            Membership Expiry
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>


                                    {

                                        payments.map(
                                            (payment) => (

                                                <tr
                                                    key={
                                                        payment._id
                                                    }
                                                >

                                                    <td>

                                                        {
                                                            payment.plan
                                                        }

                                                    </td>


                                                    <td>

                                                        ₹{
                                                            payment.amount
                                                        }

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                        `membership-payment-status ${
                                                                            payment.paymentStatus?.toLowerCase() ||
                                                                            "pending"
                                                                        }`
                                                                    }
                                                        >

                                                            {
                                                                payment.paymentStatus || "Pending"
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        {
                                                            payment.razorpayPaymentId ||
                                                            "-"
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            formatDate(
                                                                payment.paidAt
                                                            )
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            formatDate(
                                                                payment.membershipExpiryDate
                                                            )
                                                        }

                                                    </td>


                                                </tr>

                                            )
                                        )

                                    }


                                </tbody>


                            </table>


                        </div>

                    )

            }


            <div className="membership-history-actions">


                <button

                    onClick={() =>
                        navigate(
                            "/membership"
                        )
                    }

                >

                    View Membership

                </button>


                <button

                    onClick={() =>
                        navigate(
                            "/organizer-dashboard"
                        )
                    }

                >

                    Back to Dashboard

                </button>


            </div>


        </div>

    );

};


export default MembershipHistory;