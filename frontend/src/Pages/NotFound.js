import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {

    return (

        <div className="not-found-page">

            <div className="not-found-content">

                {/* ERROR CODE */}

                <div className="not-found-code">

                    <span>4</span>

                    <div className="not-found-zero">
                        🎟️
                    </div>

                    <span>4</span>

                </div>


                {/* BADGE */}

                <span className="not-found-badge">

                    PAGE NOT FOUND

                </span>


                {/* TITLE */}

                <h1>

                    Oops! This Event Doesn't Exist

                </h1>


                {/* DESCRIPTION */}

                <p>

                    The page you're looking for may have
                    been moved, deleted, or the link might
                    be incorrect.

                </p>


                {/* ACTIONS */}

                <div className="not-found-actions">

                    <Link
                        to="/"
                        className="not-found-primary-btn"
                    >

                        ← Back to Home

                    </Link>


                    <Link
                        to="/events"
                        className="not-found-secondary-btn"
                    >

                        Explore Events →

                    </Link>

                </div>


                {/* INFO */}

                <div className="not-found-info">

                    <span>
                        💡
                    </span>

                    <p>

                        Don't worry, there are plenty of
                        exciting events waiting for you
                        on EventHub.

                    </p>

                </div>

            </div>

        </div>

    );

};

export default NotFound;