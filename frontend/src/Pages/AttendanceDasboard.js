import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import "./AttendanceDasboard.css";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);


const AttendanceDashboard = () => {

    const { eventId } = useParams();

    const [stats, setStats] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [lastUpdated, setLastUpdated] = useState(null);


    // =========================================
    // FETCH ATTENDANCE STATS
    // =========================================

    const fetchStats = useCallback(async () => {

        try {

            setError("");

            const res = await API.get(
                `/qr/attendance/${eventId}`
            );

            setStats(res.data.stats);

            setLastUpdated(new Date());

        } catch (error) {

            console.error(
                "Attendance Dashboard Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load attendance data."
            );

        } finally {

            setLoading(false);

        }

    },[eventId])


    // =========================================
    // FETCH + AUTO REFRESH
    // =========================================

    useEffect(() => {

        fetchStats();

        const interval = setInterval(
            fetchStats,
            15000
        );

        return () => {

            clearInterval(interval);

        };

    }, [fetchStats]);


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="attendance-loading">

                <div className="attendance-loader">
                </div>

                <h2>
                    Loading Attendance...
                </h2>

                <p>
                    Getting the latest check-in data.
                </p>

            </div>

        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error && !stats) {

        return (

            <div className="attendance-error">

                <div className="attendance-error-icon">
                    !
                </div>

                <h2>
                    Unable to Load Attendance
                </h2>

                <p>
                    {error}
                </p>

                <button onClick={fetchStats}>
                    Try Again
                </button>

            </div>

        );

    }


    // =========================================
    // CHART DATA
    // =========================================

    const chartData = {

        labels: [
            "Checked In",
            "Pending"
        ],

        datasets: [

            {

                data: [
                    stats.checkedIn,
                    stats.pending
                ],

                backgroundColor: [
                    "#00b894",
                    "#fdcb6e"
                ],

                borderColor: [
                    "#00a884",
                    "#f0b93e"
                ],

                borderWidth: 1

            }

        ]

    };


    // =========================================
    // CHART OPTIONS
    // =========================================

    const chartOptions = {

        responsive: true,

        maintainAspectRatio: false,

        cutout: "70%",

        plugins: {

            legend: {

                position: "bottom",

                labels: {

                    usePointStyle: true,

                    padding: 20

                }

            }

        }

    };


    return (

        <div className="attendance-page">


            {/* =========================================
                HERO
            ========================================== */}

            <section className="attendance-hero">

                <div>

                    <p className="attendance-label">
                        LIVE EVENT MONITORING
                    </p>

                    <h1>
                        Attendance Dashboard
                    </h1>

                    <p className="attendance-hero-description">

                        Monitor attendee check-ins and track
                        live attendance for your event.

                    </p>


                    <div className="attendance-live-status">

                        <span className="attendance-live-dot">
                        </span>

                        Live Monitoring

                        <small>
                            Auto-refreshes every 15 seconds
                        </small>

                    </div>

                </div>


                <div className="attendance-hero-icon">
                    📊
                </div>

            </section>


            {/* =========================================
                REFRESH ERROR
            ========================================== */}

            {error && (

                <div className="attendance-warning">

                    <span>
                        ⚠️
                    </span>

                    <p>
                        Could not refresh the latest data.
                        Showing the last available attendance information.
                    </p>

                </div>

            )}


            {/* =========================================
                STATS
            ========================================== */}

            <section className="attendance-stats">


                {/* TOTAL TICKETS */}

                <div className="attendance-stat-card">

                    <div className="attendance-stat-icon tickets-icon">
                        🎟️
                    </div>

                    <div>

                        <p>
                            Total Tickets
                        </p>

                        <h2>
                            {stats.totalTickets}
                        </h2>

                    </div>

                </div>


                {/* CHECKED IN */}

                <div className="attendance-stat-card">

                    <div className="attendance-stat-icon checked-icon">
                        ✓
                    </div>

                    <div>

                        <p>
                            Checked In
                        </p>

                        <h2>
                            {stats.checkedIn}
                        </h2>

                    </div>

                </div>


                {/* PENDING */}

                <div className="attendance-stat-card">

                    <div className="attendance-stat-icon pending-icon">
                        ⏳
                    </div>

                    <div>

                        <p>
                            Pending
                        </p>

                        <h2>
                            {stats.pending}
                        </h2>

                    </div>

                </div>


                {/* ATTENDANCE */}

                <div className="attendance-stat-card">

                    <div className="attendance-stat-icon percentage-icon">
                        📈
                    </div>

                    <div>

                        <p>
                            Attendance
                        </p>

                        <h2>
                            {stats.attendance}%
                        </h2>

                    </div>

                </div>


            </section>


            {/* =========================================
                ATTENDANCE PROGRESS
            ========================================== */}

            <section className="attendance-progress-section">


                <div className="attendance-progress-header">

                    <div>

                        <p>
                            ATTENDANCE PROGRESS
                        </p>

                        <h2>
                            Event Check-In Progress
                        </h2>

                    </div>


                    <strong>
                        {stats.attendance}%
                    </strong>

                </div>


                <div className="attendance-progress">

                    <div
                        className="attendance-progress-bar"
                        style={{
                            width:
                                `${Math.min(
                                    Number(stats.attendance) || 0,
                                    100
                                )}%`
                        }}
                    >
                    </div>

                </div>


                <div className="attendance-progress-info">

                    <span>

                        {stats.checkedIn} checked in

                    </span>

                    <span>

                        {stats.pending} remaining

                    </span>

                </div>


            </section>


            {/* =========================================
                CONTENT GRID
            ========================================== */}

            <section className="attendance-content-grid">


                {/* =====================================
                    RECENT CHECK-INS
                ====================================== */}

                <div className="attendance-recent-section">


                    <div className="attendance-section-header">

                        <div>

                            <p>
                                LIVE ACTIVITY
                            </p>

                            <h2>
                                Recent Check-ins
                            </h2>

                            <span>

                                Latest attendees who entered
                                the event.

                            </span>

                        </div>


                        <div className="attendance-refresh">

                            <span>
                                ↻
                            </span>

                            {lastUpdated && (

                                <small>

                                    Updated{" "}

                                    {
                                        lastUpdated
                                            .toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                }
                                            )
                                    }

                                </small>

                            )}

                        </div>

                    </div>


                    {stats.recentCheckIns?.length === 0 ? (

                        <div className="attendance-empty">

                            <div>
                                🎫
                            </div>

                            <h3>
                                No Check-ins Yet
                            </h3>

                            <p>

                                No attendees have checked in yet.
                                New check-ins will automatically
                                appear here.

                            </p>

                        </div>

                    ) : (

                        <div className="attendance-checkin-list">

                            {
                                stats.recentCheckIns?.map(
                                    (person, index) => (

                                        <div
                                            className="attendance-checkin-card"
                                            key={
                                                person.ticketId ||
                                                person._id ||
                                                index
                                            }
                                        >


                                            <div className="attendance-avatar">

                                                {
                                                    person.username
                                                        ?.charAt(0)
                                                        .toUpperCase() ||
                                                    "U"
                                                }

                                            </div>


                                            <div className="attendance-person-info">

                                                <h3>
                                                    {
                                                        person.username ||
                                                        "Attendee"
                                                    }
                                                </h3>

                                                <p>

                                                    Seat:{" "}

                                                    <strong>

                                                        {
                                                            person.seatNumber ||
                                                            "Not Assigned"
                                                        }

                                                    </strong>

                                                </p>

                                            </div>


                                            <div className="attendance-checkin-time">

                                                <span>
                                                    Checked In
                                                </span>

                                                <strong>

                                                    {
                                                        person.checkedInAt
                                                            ? new Date(
                                                                person.checkedInAt
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                }
                                                            )
                                                            : "-"
                                                    }

                                                </strong>

                                                <small>

                                                    {
                                                        person.checkedInAt
                                                            ? new Date(
                                                                person.checkedInAt
                                                            ).toLocaleDateString()
                                                            : ""
                                                    }

                                                </small>

                                            </div>


                                            <div className="attendance-success-badge">

                                                ✓

                                            </div>


                                        </div>

                                    )
                                )
                            }

                        </div>

                    )}


                </div>


                {/* =====================================
                    DOUGHNUT CHART
                ====================================== */}

                <div className="attendance-chart-card">


                    <div className="attendance-chart-header">

                        <p>
                            ATTENDANCE OVERVIEW
                        </p>

                        <h2>
                            Check-In Status
                        </h2>

                        <span>

                            Live distribution of attendee
                            check-ins.

                        </span>

                    </div>


                    <div className="attendance-chart-container">

                        <Doughnut
                            data={chartData}
                            options={chartOptions}
                        />

                        <div className="attendance-chart-center">

                            <strong>
                                {stats.attendance}%
                            </strong>

                            <span>
                                Attendance
                            </span>

                        </div>

                    </div>


                    <div className="attendance-chart-summary">

                        <p>

                            <strong>
                                {stats.attendance}%
                            </strong>

                            {" "}of attendees have
                            checked in.

                        </p>

                    </div>


                </div>


            </section>


        </div>

    );

};


export default AttendanceDashboard;