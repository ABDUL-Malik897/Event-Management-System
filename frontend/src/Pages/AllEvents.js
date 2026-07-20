import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import toast from "react-hot-toast";

import API from "../api/api";
import EventCard from "../components/EventCard";

import { useSearchParams } from "react-router-dom";

import "./AllEvents.css";


const AllEvents = () => {

    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    const [currentPage, setCurrentPage] = useState(1);

    const eventsPerPage = 6;


    // FILTER STATES

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
    useState(
        searchParams.get("category") ||
        "All"
    );

    const [priceType, setPriceType] =
        useState("All");

    const [sortBy, setSortBy] =
        useState("default");


    // ==============================
    // FETCH EVENTS
    // ==============================

    useEffect(() => {

        const fetchEvents = async () => {

            try {

                const response =
                    await API.get(
                        "/events"
                    );


                setEvents(
                    response.data.events || []
                );


            } catch (error) {

                console.error(
                    "Error fetching events:",
                    error
                );


                toast.error(
                    error.response?.data?.message ||
                    "Unable to load events"
                );


            } finally {

                setLoading(false);

            }

        };


        fetchEvents();


    }, []);


    // ==============================
    // GET AVAILABLE CATEGORIES
    // ==============================

    const categories = useMemo(() => {

        const eventCategories =
            events
                .map(
                    event =>
                        event.category
                )
                .filter(Boolean);


        return [

            "All",

            ...new Set(
                eventCategories
            )

        ];


    }, [events]);


    // ==============================
    // FILTER + SEARCH + SORT
    // ==============================

    const filteredEvents = useMemo(() => {

        let result =
            [...events];


        // SEARCH

        if (search.trim()) {

            const searchValue =
                search
                    .toLowerCase()
                    .trim();


            result =
                result.filter(
                    event => {

                        const title =
                            event.title
                                ?.toLowerCase() ||
                            "";

                        const description =
                            event.description
                                ?.toLowerCase() ||
                            "";

                        const city =
                            event.city
                                ?.toLowerCase() ||
                            "";

                        const venue =
                            event.venue
                                ?.toLowerCase() ||
                            "";


                        return (

                            title.includes(
                                searchValue
                            ) ||

                            description.includes(
                                searchValue
                            ) ||

                            city.includes(
                                searchValue
                            ) ||

                            venue.includes(
                                searchValue
                            )

                        );

                    }
                );

        }


        // CATEGORY FILTER

        if (
            category !== "All"
        ) {

            result =
                result.filter(
                    event =>
                        event.category ===
                        category
                );

        }


        // PRICE FILTER

        if (
            priceType === "Free"
        ) {

            result =
                result.filter(
                    event =>
                        Number(
                            event.ticketPrice
                        ) === 0
                );

        }


        if (
            priceType === "Paid"
        ) {

            result =
                result.filter(
                    event =>
                        Number(
                            event.ticketPrice
                        ) > 0
                );

        }


        // SORTING

        if (
            sortBy === "dateSoon"
        ) {

            result.sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );

        }


        if (
            sortBy === "dateLater"
        ) {

            result.sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );

        }


        if (
            sortBy === "priceLow"
        ) {

            result.sort(
                (a, b) =>
                    Number(
                        a.ticketPrice
                    ) -
                    Number(
                        b.ticketPrice
                    )
            );

        }


        if (
            sortBy === "priceHigh"
        ) {

            result.sort(
                (a, b) =>
                    Number(
                        b.ticketPrice
                    ) -
                    Number(
                        a.ticketPrice
                    )
            );

        }


        return result;


    }, [
        events,
        search,
        category,
        priceType,
        sortBy
    ]);


    // ==============================
    // RESET PAGE WHEN FILTERS CHANGE
    // ==============================

    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        category,
        priceType,
        sortBy
    ]);


    // ==============================
    // PAGINATION
    // ==============================

    const totalPages =
        Math.ceil(
            filteredEvents.length /
            eventsPerPage
        );

    const indexOfLastEvent =
        currentPage *
        eventsPerPage;

    const indexOfFirstEvent =
        indexOfLastEvent -
        eventsPerPage;

    const currentEvents =
        filteredEvents.slice(
            indexOfFirstEvent,
            indexOfLastEvent
        );


    // ==============================
    // GET CATEGORY FROM URL
    // ==============================

    useEffect(() => {

        const categoryFromUrl =
            searchParams.get(
                "category"
            );

        setCategory(
            categoryFromUrl ||
            "All"
        );

    }, [searchParams]);


    // ==============================
    // RESET FILTERS
    // ==============================

    const handleResetFilters = () => {

        setSearch("");

        setCategory(
            "All"
        );

        setPriceType(
            "All"
        );

        setSortBy(
            "default"
        );

    };


    // ==============================
    // CHECK ACTIVE FILTER
    // ==============================

    const hasActiveFilters =

        search.trim() !== "" ||

        category !== "All" ||

        priceType !== "All" ||

        sortBy !== "default";


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div className="events-loading">

                <div className="events-loader">
                </div>

                <h2>
                    Finding amazing events...
                </h2>

                <p>
                    Please wait while we load
                    the latest events for you.
                </p>

            </div>

        );

    }


    return (

        <div className="all-events-page">


            {/* =========================
                HERO
            ========================== */}

            <section className="events-hero">

                <div className="events-hero-content">

                    <p className="events-hero-label">
                        DISCOVER • EXPLORE • EXPERIENCE
                    </p>

                    <h1>
                        Find Your Next Experience
                    </h1>

                    <p className="events-hero-description">

                        Explore exciting events,
                        discover new experiences and
                        book your next unforgettable
                        moment with EventHub.

                    </p>


                    {/* HERO SEARCH */}

                    <div className="events-hero-search">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search events, cities or venues..."
                            value={search}
                            onChange={
                                e =>
                                    setSearch(
                                        e.target.value
                                    )
                            }
                        />


                        {search && (

                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                                className="events-clear-search"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>

                        )}

                    </div>

                </div>

            </section>


            {/* =========================
                EVENTS SECTION
            ========================== */}

            <section className="events-section">


                {/* SECTION HEADER */}

                <div className="events-section-header">

                    <div>

                        <p className="events-section-label">
                            EXPLORE EVENTS
                        </p>

                        <h2>
                            All Events
                        </h2>

                        <p>
                            Find events based on your
                            interests, location and budget.
                        </p>

                    </div>


                    <div className="events-count">

                        <strong>
                            {filteredEvents.length}
                        </strong>

                        <span>

                            {
                                filteredEvents.length === 1
                                    ? "Event Found"
                                    : "Events Found"
                            }

                        </span>

                    </div>

                </div>


                {/* =========================
                    FILTER BAR
                ========================== */}

                <div className="events-filter-container">


                    {/* CATEGORY */}

                    <div className="events-filter-group">

                        <label>
                            Category
                        </label>

                        <select
                            value={category}
                            onChange={
                                e =>
                                    setCategory(
                                        e.target.value
                                    )
                            }
                        >

                            {
                                categories.map(
                                    item => (

                                        <option
                                            key={item}
                                            value={item}
                                        >

                                            {
                                                item === "All"
                                                    ? "All Categories"
                                                    : item
                                            }

                                        </option>

                                    )
                                )
                            }

                        </select>

                    </div>


                    {/* PRICE */}

                    <div className="events-filter-group">

                        <label>
                            Price
                        </label>

                        <select
                            value={priceType}
                            onChange={
                                e =>
                                    setPriceType(
                                        e.target.value
                                    )
                            }
                        >

                            <option value="All">
                                All Prices
                            </option>

                            <option value="Free">
                                Free Events
                            </option>

                            <option value="Paid">
                                Paid Events
                            </option>

                        </select>

                    </div>


                    {/* SORT */}

                    <div className="events-filter-group">

                        <label>
                            Sort By
                        </label>

                        <select
                            value={sortBy}
                            onChange={
                                e =>
                                    setSortBy(
                                        e.target.value
                                    )
                            }
                        >

                            <option value="default">
                                Recommended
                            </option>

                            <option value="dateSoon">
                                Date: Soonest First
                            </option>

                            <option value="dateLater">
                                Date: Latest First
                            </option>

                            <option value="priceLow">
                                Price: Low to High
                            </option>

                            <option value="priceHigh">
                                Price: High to Low
                            </option>

                        </select>

                    </div>


                    {/* RESET */}

                    <div className="events-filter-reset">

                        <button
                            type="button"
                            onClick={
                                handleResetFilters
                            }
                            disabled={
                                !hasActiveFilters
                            }
                        >
                            Reset Filters
                        </button>

                    </div>

                </div>


                {/* =========================
                    ACTIVE FILTER INFO
                ========================== */}

                {hasActiveFilters && (

                    <div className="events-active-filters">

                        <span>
                            Showing{" "}
                            {filteredEvents.length}
                            {" "}of{" "}
                            {events.length}
                            {" "}events
                        </span>


                        {search && (

                            <span className="filter-chip">
                                Search: "{search}"
                            </span>

                        )}


                        {category !== "All" && (

                            <span className="filter-chip">
                                {category}
                            </span>

                        )}


                        {priceType !== "All" && (

                            <span className="filter-chip">
                                {priceType}
                            </span>

                        )}

                    </div>

                )}


                {/* =========================
                    EVENTS
                ========================== */}

                {
                    filteredEvents.length === 0
                        ? (

                            <div className="events-empty">

                                <div className="events-empty-icon">
                                    🔍
                                </div>

                                <h2>
                                    No Matching Events Found
                                </h2>

                                <p>
                                    We couldn't find any events
                                    matching your current search
                                    or filters.
                                </p>


                                {hasActiveFilters && (

                                    <button
                                        type="button"
                                        className="events-reset-empty-btn"
                                        onClick={
                                            handleResetFilters
                                        }
                                    >
                                        Clear All Filters
                                    </button>

                                )}

                            </div>

                        )
                        : (

                            <div className="events-grid">

                                {
                                    currentEvents.map(
                                        event => (

                                            <EventCard
                                                key={
                                                    event._id
                                                }
                                                event={
                                                    event
                                                }
                                            />

                                        )
                                    )
                                }

                            </div>

                        )


                }

                {/* =========================
                    PAGINATION
                ========================== */}

                {
                    totalPages > 1 && (

                        <div className="events-pagination">

                            <button
                                type="button"
                                className="events-pagination-nav"
                                onClick={() =>
                                    setCurrentPage(
                                        prev =>
                                            Math.max(
                                                prev - 1,
                                                1
                                            )
                                    )
                                }
                                disabled={
                                    currentPage === 1
                                }
                            >
                                ← Previous
                            </button>


                            <div className="events-pagination-numbers">

                                {
                                    Array.from(
                                        {
                                            length: totalPages
                                        },
                                        (_, index) =>
                                            index + 1
                                    ).map(
                                        page => (

                                            <button
                                                type="button"
                                                key={page}
                                                className={
                                                    currentPage === page
                                                        ? "events-page-active"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    setCurrentPage(page)
                                                }
                                            >
                                                {page}
                                            </button>

                                        )
                                    )
                                }

                            </div>


                            <button
                                type="button"
                                className="events-pagination-nav"
                                onClick={() =>
                                    setCurrentPage(
                                        prev =>
                                            Math.min(
                                                prev + 1,
                                                totalPages
                                            )
                                    )
                                }
                                disabled={
                                    currentPage === totalPages
                                }
                            >
                                Next →
                            </button>

                        </div>

                    )
                }

                            </section>

                        </div>

                    );

};


export default AllEvents;