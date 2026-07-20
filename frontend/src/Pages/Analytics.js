import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api/api";
import "./Analytics.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const Analytics = () => {

    const [events, setEvents] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);


    // =========================================
    // FETCH ANALYTICS
    // =========================================

    useEffect(() => {

        const fetchAnalytics = async () => {

            try {

                const eventRes = await API.get(
                    "/analytics/events"
                );

                setEvents(
                    eventRes.data.events
                );


                const summaryRes = await API.get(
                    "/analytics"
                );

                setSummary(
                    summaryRes.data.analytics
                );

            } catch (error) {

                console.error(
                    "Analytics Error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load analytics"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchAnalytics();

    }, []);


    // =========================================
    // REVENUE CHART
    // =========================================

    const revenueData = {

        labels: events.map(
            (event) => event.title
        ),

        datasets: [
            {
                label: "Revenue (₹)",

                data: events.map(
                    (event) => event.revenue
                ),

                backgroundColor:
                    "rgba(108, 92, 231, 0.75)",

                borderColor:
                    "rgba(108, 92, 231, 1)",

                borderWidth: 1,

                borderRadius: 6
            }
        ]

    };


    // =========================================
    // TICKET CHART
    // =========================================

    const ticketData = {

        labels: events.map(
            (event) => event.title
        ),

        datasets: [
            {
                label: "Tickets Sold",

                data: events.map(
                    (event) => event.ticketsSold
                ),

                backgroundColor:
                    "rgba(9, 132, 227, 0.75)",

                borderColor:
                    "rgba(9, 132, 227, 1)",

                borderWidth: 1,

                borderRadius: 6
            }
        ]

    };


    // =========================================
    // CHART OPTIONS
    // =========================================

    const chartOptions = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                position: "top"

            }

        },

        scales: {

            y: {

                beginAtZero: true

            }

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="analytics-loading">

                <div className="analytics-loader">
                </div>

                <h2>
                    Loading Analytics...
                </h2>

                <p>
                    Preparing your event performance data.
                </p>

            </div>

        );

    }


    return (

        <div className="analytics-page">


            {/* =========================================
                HERO
            ========================================== */}

            <section className="analytics-hero">

                <div>

                    <p className="analytics-label">
                        ORGANIZER ANALYTICS
                    </p>

                    <h1>
                        Event Performance
                    </h1>

                    <p className="analytics-hero-description">

                        Track your event performance,
                        ticket sales, revenue and audience
                        engagement from one place.

                    </p>

                </div>


                <div className="analytics-hero-icon">

                    📊

                </div>

            </section>


            {/* =========================================
                SUMMARY
            ========================================== */}

            {summary && (

                <>


                    <section className="analytics-section">


                        <div className="analytics-section-header">

                            <div>

                                <p className="analytics-section-label">
                                    OVERVIEW
                                </p>

                                <h2>
                                    Analytics Summary
                                </h2>

                                <span>
                                    A quick overview of your
                                    event performance.
                                </span>

                            </div>

                        </div>


                        {/* SUMMARY CARDS */}

                        <div className="analytics-summary-grid">


                            {/* TOTAL EVENTS */}

                            <div className="analytics-summary-card">

                                <div className="analytics-card-icon analytics-icon-events">
                                    📅
                                </div>

                                <div>

                                    <p>
                                        Total Events
                                    </p>

                                    <h3>
                                        {summary.totalEvents}
                                    </h3>

                                </div>

                            </div>


                            {/* TOTAL REVENUE */}

                            <div className="analytics-summary-card">

                                <div className="analytics-card-icon analytics-icon-revenue">
                                    ₹
                                </div>

                                <div>

                                    <p>
                                        Total Revenue
                                    </p>

                                    <h3>
                                        ₹{
                                            Number(
                                                summary.totalRevenue || 0
                                            ).toLocaleString("en-IN")
                                        }
                                    </h3>

                                </div>

                            </div>


                            {/* TICKETS SOLD */}

                            <div className="analytics-summary-card">

                                <div className="analytics-card-icon analytics-icon-tickets">
                                    🎟️
                                </div>

                                <div>

                                    <p>
                                        Tickets Sold
                                    </p>

                                    <h3>
                                        {
                                            summary.totalTicketsSold
                                        }
                                    </h3>

                                </div>

                            </div>


                            {/* AVERAGE TICKETS */}

                            <div className="analytics-summary-card">

                                <div className="analytics-card-icon analytics-icon-average">
                                    📈
                                </div>

                                <div>

                                    <p>
                                        Average Tickets / Event
                                    </p>

                                    <h3>
                                        {
                                            summary.averageTickets
                                        }
                                    </h3>

                                </div>

                            </div>


                        </div>

                    </section>


                    {/* =========================================
                        EARNINGS
                    ========================================== */}

                    <section className="analytics-section">


                        <div className="analytics-section-header">

                            <div>

                                <p className="analytics-section-label">
                                    FINANCIAL OVERVIEW
                                </p>

                                <h2>
                                    Earnings Breakdown
                                </h2>

                                <span>
                                    View how revenue is distributed
                                    between you and the platform.
                                </span>

                            </div>

                        </div>


                        <div className="analytics-earnings-grid">


                            <div className="analytics-earning-card platform-earning-card">

                                <div>

                                    <p>
                                        Platform Commission
                                    </p>

                                    <h2>
                                        ₹{
                                            Number(
                                                summary.platformCommission || 0
                                            ).toLocaleString("en-IN")
                                        }
                                    </h2>

                                </div>

                                <span>
                                    🏢
                                </span>

                            </div>


                            <div className="analytics-earning-card organizer-earning-card">

                                <div>

                                    <p>
                                        Your Earnings
                                    </p>

                                    <h2>
                                        ₹{
                                            Number(
                                                summary.organizerEarnings || 0
                                            ).toLocaleString("en-IN")
                                        }
                                    </h2>

                                </div>

                                <span>
                                    💰
                                </span>

                            </div>


                        </div>

                    </section>


                    {/* =========================================
                        BEST EVENT
                    ========================================== */}

                    {summary.bestEvent && (

                        <section className="analytics-best-event">

                            <div className="analytics-best-event-badge">
                                🏆 BEST PERFORMING EVENT
                            </div>


                            <div className="analytics-best-event-content">

                                <div>

                                    <p>
                                        Top Performer
                                    </p>

                                    <h2>
                                        {
                                            summary.bestEvent.title
                                        }
                                    </h2>

                                </div>


                                <div className="analytics-best-event-stats">


                                    <div>

                                        <span>
                                            Revenue
                                        </span>

                                        <strong>
                                            ₹{
                                                Number(
                                                    summary.bestEvent.revenue || 0
                                                ).toLocaleString("en-IN")
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Tickets Sold
                                        </span>

                                        <strong>
                                            {
                                                summary.bestEvent.ticketsSold
                                            }
                                        </strong>

                                    </div>


                                </div>

                            </div>

                        </section>

                    )}


                    {/* =========================================
                        MONTHLY REVENUE
                    ========================================== */}

                    <section className="analytics-section">


                        <div className="analytics-section-header">

                            <div>

                                <p className="analytics-section-label">
                                    REVENUE TIMELINE
                                </p>

                                <h2>
                                    Monthly Revenue
                                </h2>

                                <span>
                                    Track your earnings across
                                    different months.
                                </span>

                            </div>

                        </div>


                        <div className="analytics-monthly-grid">

                            {
                                summary.monthlyRevenue &&
                                Object.entries(
                                    summary.monthlyRevenue
                                ).length > 0 ? (

                                    Object.entries(
                                        summary.monthlyRevenue
                                    ).map(
                                        ([month, revenue]) => (

                                            <div
                                                className="analytics-month-card"
                                                key={month}
                                            >

                                                <p>
                                                    {month}
                                                </p>

                                                <h3>
                                                    ₹{
                                                        Number(
                                                            revenue || 0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )
                                                    }
                                                </h3>

                                            </div>

                                        )
                                    )

                                ) : (

                                    <div className="analytics-empty">

                                        <p>
                                            No monthly revenue
                                            data available.
                                        </p>

                                    </div>

                                )
                            }

                        </div>

                    </section>


                    {/* =========================================
                        TOP EVENTS
                    ========================================== */}

                    <section className="analytics-section">


                        <div className="analytics-section-header">

                            <div>

                                <p className="analytics-section-label">
                                    TOP PERFORMANCE
                                </p>

                                <h2>
                                    Top 5 Events
                                </h2>

                                <span>
                                    Your highest-performing events.
                                </span>

                            </div>

                        </div>


                        <div className="analytics-top-events">

                            {
                                summary.topEvents &&
                                summary.topEvents.length > 0 ? (

                                    summary.topEvents.map(
                                        (event, index) => (

                                            <div
                                                className="analytics-top-event-card"
                                                key={
                                                    event.eventId ||
                                                    event._id ||
                                                    index
                                                }
                                            >

                                                <div className="analytics-event-rank">

                                                    {
                                                        index + 1
                                                    }

                                                </div>


                                                <div className="analytics-top-event-info">

                                                    <h3>
                                                        {
                                                            event.title
                                                        }
                                                    </h3>

                                                    <p>
                                                        Event Performance
                                                    </p>

                                                </div>


                                                <div className="analytics-top-event-stats">


                                                    <div>

                                                        <span>
                                                            Revenue
                                                        </span>

                                                        <strong>
                                                            ₹{
                                                                Number(
                                                                    event.revenue || 0
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )
                                                            }
                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Tickets
                                                        </span>

                                                        <strong>
                                                            {
                                                                event.ticketsSold
                                                            }
                                                        </strong>

                                                    </div>


                                                    <div>

                                                        <span>
                                                            Occupancy
                                                        </span>

                                                        <strong>
                                                            {
                                                                event.occupancy
                                                            }%
                                                        </strong>

                                                    </div>


                                                </div>

                                            </div>

                                        )
                                    )

                                ) : (

                                    <div className="analytics-empty">

                                        <p>
                                            No top events available.
                                        </p>

                                    </div>

                                )
                            }

                        </div>

                    </section>

                </>

            )}


            {/* =========================================
                CHARTS
            ========================================== */}

            <section className="analytics-section">


                <div className="analytics-section-header">

                    <div>

                        <p className="analytics-section-label">
                            VISUAL INSIGHTS
                        </p>

                        <h2>
                            Performance Charts
                        </h2>

                        <span>
                            Compare revenue and ticket sales
                            across your events.
                        </span>

                    </div>

                </div>


                <div className="analytics-charts-grid">


                    {/* REVENUE CHART */}

                    <div className="analytics-chart-card">

                        <div className="analytics-chart-header">

                            <div>

                                <p>
                                    REVENUE
                                </p>

                                <h3>
                                    Revenue by Event
                                </h3>

                            </div>

                            <span>
                                ₹
                            </span>

                        </div>


                        <div className="analytics-chart">

                            <Bar
                                data={revenueData}
                                options={chartOptions}
                            />

                        </div>

                    </div>


                    {/* TICKET CHART */}

                    <div className="analytics-chart-card">

                        <div className="analytics-chart-header">

                            <div>

                                <p>
                                    TICKET SALES
                                </p>

                                <h3>
                                    Tickets Sold by Event
                                </h3>

                            </div>

                            <span>
                                🎟️
                            </span>

                        </div>


                        <div className="analytics-chart">

                            <Bar
                                data={ticketData}
                                options={chartOptions}
                            />

                        </div>

                    </div>


                </div>

            </section>


            {/* =========================================
                EVENT DETAILS
            ========================================== */}

            <section className="analytics-section">


                <div className="analytics-section-header">

                    <div>

                        <p className="analytics-section-label">
                            EVENT BREAKDOWN
                        </p>

                        <h2>
                            Event Details
                        </h2>

                        <span>
                            Detailed performance for each
                            of your events.
                        </span>

                    </div>

                </div>


                {events.length === 0 ? (

                    <div className="analytics-empty">

                        <div>
                            📊
                        </div>

                        <h3>
                            No Events Found
                        </h3>

                        <p>
                            Create events to start seeing
                            analytics and performance data.
                        </p>

                    </div>

                ) : (

                    <div className="analytics-event-grid">

                        {
                            events.map((event) => (

                                <div
                                    className="analytics-event-card"
                                    key={event.eventId}
                                >

                                    <div className="analytics-event-card-header">

                                        <div>

                                            <p>
                                                EVENT
                                            </p>

                                            <h3>
                                                {event.title}
                                            </h3>

                                        </div>


                                        <span>
                                            📊
                                        </span>

                                    </div>


                                    <div className="analytics-event-card-stats">


                                        <div>

                                            <span>
                                                Revenue
                                            </span>

                                            <strong>
                                                ₹{
                                                    Number(
                                                        event.revenue || 0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Tickets Sold
                                            </span>

                                            <strong>
                                                {
                                                    event.ticketsSold
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Occupancy
                                            </span>

                                            <strong>
                                                {
                                                    event.occupancy
                                                }%
                                            </strong>

                                        </div>


                                    </div>


                                    {/* OCCUPANCY PROGRESS */}

                                    <div className="analytics-occupancy">

                                        <div>

                                            <span>
                                                Event Occupancy
                                            </span>

                                            <strong>
                                                {
                                                    event.occupancy
                                                }%
                                            </strong>

                                        </div>


                                        <div className="analytics-progress">

                                            <div
                                                className="analytics-progress-bar"
                                                style={{
                                                    width:
                                                        `${Math.min(
                                                            Number(
                                                                event.occupancy
                                                            ) || 0,
                                                            100
                                                        )}%`
                                                }}
                                            >
                                            </div>

                                        </div>

                                    </div>


                                </div>

                            ))
                        }

                    </div>

                )}

            </section>


        </div>

    );

};

export default Analytics;