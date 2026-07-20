import React, {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import toast from "react-hot-toast";

import API from "../api/api";

import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
} from "chart.js";

import {
    Doughnut,
    Bar,
    Line
} from "react-chartjs-2";

import "./AdminDashboard.css";


ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
);


const AdminDashboard = () => {

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // FETCH DASHBOARD
    // ==========================================

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response =
                    await API.get(
                        "/admin/dashboard"
                    );


                setDashboard(
                    response.data.dashboard
                );


            } catch (error) {

                console.error(
                    "Admin Dashboard Error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load admin dashboard"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchDashboard();


    }, []);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="admin-dashboard-loading">

                <div className="admin-dashboard-spinner">
                </div>

                <h2>
                    Loading Dashboard...
                </h2>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (!dashboard) {

        return (

            <div className="admin-dashboard-error">

                <h2>
                    Unable to Load Dashboard
                </h2>

                <p>
                    Please refresh the page
                    and try again.
                </p>

            </div>

        );

    }


    const {

        stats = {},

        eventCategories = [],

        userGrowth = [],

        eventGrowth = [],

        recentEvents = [],

        recentRequests = []

    } = dashboard;


    // ==========================================
    // USER DISTRIBUTION CHART
    // ==========================================

    const userDistributionData = {

        labels: [
            "Users",
            "Organizers",
            "Admins"
        ],

        datasets: [

            {

                data: [

                    stats.totalUsers ?? 0,

                    stats.totalOrganizers ?? 0,

                    stats.totalAdmins ?? 0

                ],

                backgroundColor: [

                    "#6366f1",

                    "#8b5cf6",

                    "#06b6d4"

                ],

                borderWidth: 0

            }

        ]

    };


    // ==========================================
    // EVENT STATUS CHART
    // ==========================================

    const eventStatusData = {

        labels: [

            "Upcoming",

            "Completed"

        ],

        datasets: [

            {

                data: [

                    stats.upcomingEvents ?? 0,

                    stats.completedEvents ?? 0

                ],

                backgroundColor: [

                    "#10b981",

                    "#f59e0b"

                ],

                borderWidth: 0

            }

        ]

    };


    // ==========================================
    // EVENT CATEGORY CHART
    // ==========================================

    const categoryData = {

        labels:

            eventCategories.map(
                category =>
                    category._id ||
                    "Other"
            ),

        datasets: [

            {

                label:
                    "Number of Events",

                data:

                    eventCategories.map(
                        category =>
                            category.count ?? 0
                    ),

                backgroundColor:
                    "#6366f1"

            }

        ]

    };


    // ==========================================
    // GROWTH CHART
    // ==========================================

    const growthLabels = [

        ...new Set([

            ...userGrowth.map(
                item =>
                    `${item._id.month}/${item._id.year}`
            ),

            ...eventGrowth.map(
                item =>
                    `${item._id.month}/${item._id.year}`
            )

        ])

    ];


    const findGrowthValue = (
        data,
        label
    ) => {

        const found = data.find(

            item =>

                `${item._id.month}/${item._id.year}` ===
                label

        );


        return found
            ? found.count
            : 0;

    };


    const growthData = {

        labels:
            growthLabels,

        datasets: [

            {

                label:
                    "New Users",

                data:

                    growthLabels.map(

                        label =>
                            findGrowthValue(
                                userGrowth,
                                label
                            )

                    ),

                borderColor:
                    "#6366f1",

                backgroundColor:
                    "#6366f1",

                tension:
                    0.4

            },

            {

                label:
                    "New Events",

                data:

                    growthLabels.map(

                        label =>
                            findGrowthValue(
                                eventGrowth,
                                label
                            )

                    ),

                borderColor:
                    "#10b981",

                backgroundColor:
                    "#10b981",

                tension:
                    0.4

            }

        ]

    };


    // ==========================================
    // CHART OPTIONS
    // ==========================================

    const doughnutOptions = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                position:
                    "bottom"

            }

        }

    };


    return (

        <div className="admin-dashboard">


            {/* =================================
                HEADER
            ================================== */}

            <section className="admin-dashboard-header">

                <div>

                    <span>
                        ADMIN CONTROL CENTER
                    </span>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Monitor users, organizers,
                        events and platform activity
                        from one place.
                    </p>

                </div>


                <Link
                    to="/admin/requests"
                    className="admin-dashboard-request-btn"
                >

                    Review Organizer Requests

                    {
                        (stats.pendingRequests ?? 0) > 0 && (

                            <strong>
                                {stats.pendingRequests}
                            </strong>

                        )
                    }

                </Link>

            </section>


            {/* =================================
                STAT CARDS
            ================================== */}

            <section className="admin-dashboard-stats">


                <div className="admin-stat-card users">

                    <div>
                        👥
                    </div>

                    <span>
                        Total Users
                    </span>

                    <h2>
                        {stats.totalUsers ?? 0}
                    </h2>

                </div>


                <div className="admin-stat-card organizers">

                    <div>
                        🧑‍💼
                    </div>

                    <span>
                        Organizers
                    </span>

                    <h2>
                        {stats.totalOrganizers ?? 0}
                    </h2>

                </div>


                <div className="admin-stat-card events">

                    <div>
                        🎪
                    </div>

                    <span>
                        Total Events
                    </span>

                    <h2>
                        {stats.totalEvents ?? 0}
                    </h2>

                </div>


                <div className="admin-stat-card pending">

                    <div>
                        ⏳
                    </div>

                    <span>
                        Pending Requests
                    </span>

                    <h2>
                        {stats.pendingRequests ?? 0}
                    </h2>

                </div>


            </section>


            {/* =================================
                DOUGHNUT CHARTS
            ================================== */}

            <section className="admin-chart-grid">


                <div className="admin-chart-card">

                    <div className="admin-chart-heading">

                        <h3>
                            User Distribution
                        </h3>

                        <p>
                            Platform users by role
                        </p>

                    </div>


                    <div className="admin-doughnut">

                        <Doughnut
                            data={
                                userDistributionData
                            }
                            options={
                                doughnutOptions
                            }
                        />

                    </div>

                </div>


                <div className="admin-chart-card">

                    <div className="admin-chart-heading">

                        <h3>
                            Event Status
                        </h3>

                        <p>
                            Upcoming vs completed events
                        </p>

                    </div>


                    <div className="admin-doughnut">

                        <Doughnut
                            data={
                                eventStatusData
                            }
                            options={
                                doughnutOptions
                            }
                        />

                    </div>

                </div>


            </section>


            {/* =================================
                CATEGORY BAR CHART
            ================================== */}

            <section className="admin-large-chart-card">

                <div className="admin-chart-heading">

                    <h3>
                        Events by Category
                    </h3>

                    <p>
                        Distribution of events across categories
                    </p>

                </div>


                <div className="admin-bar-chart">

                    <Bar
                        data={
                            categoryData
                        }
                    />

                </div>

            </section>


            {/* =================================
                GROWTH LINE CHART
            ================================== */}

            <section className="admin-large-chart-card">

                <div className="admin-chart-heading">

                    <h3>
                        Platform Growth
                    </h3>

                    <p>
                        Monthly user registrations
                        and new events
                    </p>

                </div>


                <div className="admin-growth-chart">

                    <Line
                        data={
                            growthData
                        }
                    />

                </div>

            </section>


            {/* =================================
                RECENT ACTIVITY
            ================================== */}

            <section className="admin-recent-grid">


                {/* RECENT EVENTS */}

                <div className="admin-recent-card">

                    <div className="admin-recent-heading">

                        <h3>
                            Recent Events
                        </h3>

                        <Link to="/events">
                            View All
                        </Link>

                    </div>


                    {
                        recentEvents.length === 0
                            ? (

                                <p className="admin-no-data">
                                    No events found.
                                </p>

                            )
                            : (

                                recentEvents.map(
                                    event => (

                                        <div
                                            key={
                                                event._id
                                            }
                                            className="admin-recent-item"
                                        >

                                            <div>

                                                <strong>
                                                    {
                                                        event.title ||
                                                        "Untitled Event"
                                                    }
                                                </strong>

                                                <span>

                                                    {
                                                        event.category ||
                                                        "Other"
                                                    }

                                                    {" • "}

                                                    {
                                                        event.city ||
                                                        "Unknown"
                                                    }

                                                </span>

                                            </div>


                                            <span>

                                                {
                                                    event.date
                                                        ? new Date(
                                                            event.date
                                                        )
                                                            .toLocaleDateString()
                                                        : "N/A"
                                                }

                                            </span>

                                        </div>

                                    )
                                )

                            )
                    }

                </div>


                {/* RECENT REQUESTS */}

                <div className="admin-recent-card">

                    <div className="admin-recent-heading">

                        <h3>
                            Recent Applications
                        </h3>

                        <Link to="/admin/requests">
                            Review
                        </Link>

                    </div>


                    {
                        recentRequests.length === 0
                            ? (

                                <p className="admin-no-data">
                                    No applications found.
                                </p>

                            )
                            : (

                                recentRequests.map(
                                    request => (

                                        <div
                                            key={
                                                request._id
                                            }
                                            className="admin-recent-item"
                                        >

                                            <div>

                                                <strong>
                                                    {
                                                        request.user
                                                            ?.username ||
                                                        "User"
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        request.businessName ||
                                                        request.organizationName ||
                                                        "Not provided"
                                                    }
                                                </span>

                                            </div>


                                            <span
                                                className={
                                                    `admin-status-badge ${
                                                        request.status
                                                            ?.toLowerCase() ||
                                                        "pending"
                                                    }`
                                                }
                                            >
                                                {
                                                    request.status ||
                                                    "Pending"
                                                }
                                            </span>

                                        </div>

                                    )
                                )

                            )
                    }

                </div>


            </section>


        </div>

    );

};


export default AdminDashboard;