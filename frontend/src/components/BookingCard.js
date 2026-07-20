import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/api";
import "./BookingCard.css";

const BookingCard = ({ booking, onCancel }) => {

    // =========================
    // CANCEL UNPAID BOOKING
    // =========================

    const handleCancel = async () => {

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmCancel) {
            return;
        }

        try {

            const response = await API.put(
                `/booking/${booking._id}/cancel`
            );

            toast.success(
                response.data.message ||
                "Booking cancelled successfully"
            );

            if (onCancel) {
                onCancel(booking._id);
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Cancellation failed"
            );

        }

    };


    // =========================
    // REFUND PAID BOOKING
    // =========================

    const handleRefund = async () => {

        const confirmRefund = window.confirm(
            "Are you sure you want to cancel this booking and request a refund?"
        );

        if (!confirmRefund) {
            return;
        }

        try {

            const response = await API.post(
                `/payment/refund/${booking._id}`
            );

            toast.success(
                response.data.message ||
                "Refund request submitted successfully"
            );

            if (onCancel) {
                onCancel(booking._id);
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Refund failed"
            );

        }

    };


    return (

        <div
            className={`booking-card ${
                booking.bookingStatus === "Cancelled"
                    ? "booking-card-cancelled"
                    : ""
            }`}
        >

            <div className="booking-card-top">

                <div className="booking-card-title-section">

                    <div className="booking-card-event-icon">
                        🎟️
                    </div>

                    <div>

                        <p className="booking-card-label">
                            EVENT BOOKING
                        </p>

                        <h2>
                            {booking.event?.title || "Event"}
                        </h2>

                    </div>

                </div>


                <div className="booking-card-badges">

                    <span
                        className={`booking-status-badge ${
                            booking.bookingStatus === "Booked"
                                ? "booking-status-booked"
                                : "booking-status-cancelled"
                        }`}
                    >
                        {
                            booking.bookingStatus === "Booked"
                                ? "✓ Booked"
                                : "✕ Cancelled"
                        }
                    </span>


                    <span
                        className={`booking-payment-badge payment-${booking.paymentStatus?.toLowerCase()}`}
                    >
                        {booking.paymentStatus}
                    </span>

                </div>

            </div>


            <div className="booking-card-details">

                <div className="booking-detail-item">

                    <div className="booking-detail-icon">
                        📅
                    </div>

                    <div>

                        <span>
                            Event Date
                        </span>

                        <strong>
                            {
                                booking.event?.date
                                    ? new Date(
                                        booking.event.date
                                    ).toLocaleDateString()
                                    : "N/A"
                            }
                        </strong>

                    </div>

                </div>


                <div className="booking-detail-item">

                    <div className="booking-detail-icon">
                        📍
                    </div>

                    <div>

                        <span>
                            Venue
                        </span>

                        <strong>
                            {
                                booking.event?.venue ||
                                "N/A"
                            }
                        </strong>

                    </div>

                </div>


                <div className="booking-detail-item">

                    <div className="booking-detail-icon">
                        🎫
                    </div>

                    <div>

                        <span>
                            Ticket Price
                        </span>

                        <strong>
                            ₹{
                                booking.ticketPrice ??
                                booking.event?.ticketPrice ??
                                0
                            }
                        </strong>

                    </div>

                </div>


                <div className="booking-detail-item">

                    <div className="booking-detail-icon">
                        👥
                    </div>

                    <div>

                        <span>
                            Tickets
                        </span>

                        <strong>
                            {
                                booking.quantity ??
                                booking.tickets?.length ??
                                0
                            }
                        </strong>

                    </div>

                </div>

            </div>


            <div className="booking-payment-section">

                <div className="booking-payment-heading">

                    <div>

                        <p className="booking-payment-label">
                            PAYMENT SUMMARY
                        </p>

                        <h3>
                            Payment Details
                        </h3>

                    </div>


                    <div className="booking-total-amount">

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            ₹{booking.totalAmount ?? 0}
                        </strong>

                    </div>

                </div>


                {booking.paymentStatus === "Paid" && (

                    <div className="booking-transaction-details">

                        <div className="booking-transaction-item">

                            <span>
                                Payment ID
                            </span>

                            <p title={booking.razorpayPaymentId}>

                                {
                                    booking.razorpayPaymentId ||
                                    "Not Available"
                                }

                            </p>

                        </div>


                        <div className="booking-transaction-item">

                            <span>
                                Order ID
                            </span>

                            <p title={booking.razorpayOrderId}>

                                {
                                    booking.razorpayOrderId ||
                                    "Not Available"
                                }

                            </p>

                        </div>

                    </div>

                )}


                {
                    booking.bookingStatus === "Booked" &&
                    booking.paymentStatus === "Paid" && (

                        <div className="booking-refund-info">

                            <span>
                                ℹ️
                            </span>

                            <p>
                                This is a paid booking.
                                Cancelling this booking will
                                initiate a refund request.
                            </p>

                        </div>

                    )
                }


                {
                    booking.bookingStatus === "Cancelled" && (

                        <div className="booking-cancelled-info">

                            <span>
                                ✕
                            </span>

                            <p>
                                This booking has been cancelled.
                            </p>

                        </div>

                    )
                }

            </div>


            <div className="booking-card-actions">

                <Link
                    to={`/ticket/${booking._id}`}
                    className="booking-view-ticket-btn"
                >
                    <span>
                        🎟️
                    </span>

                    View Tickets
                </Link>


                {
                    booking.bookingStatus === "Booked" &&
                    booking.paymentStatus !== "Paid" && (

                        <button
                            type="button"
                            className="booking-cancel-btn"
                            onClick={handleCancel}
                        >
                            Cancel Booking
                        </button>

                    )
                }


                {
                    booking.bookingStatus === "Booked" &&
                    booking.paymentStatus === "Paid" && (

                        <button
                            type="button"
                            className="booking-refund-btn"
                            onClick={handleRefund}
                        >
                            Cancel & Request Refund
                        </button>

                    )
                }

            </div>

        </div>

    );

};

export default BookingCard;