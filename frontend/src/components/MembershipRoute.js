import React from "react";

import {
    Navigate
} from "react-router-dom";

import useAuthContext
    from "../hooks/useAuthContext";


const MembershipRoute = ({
    children
}) => {

    const { user } =
        useAuthContext();


    // ==========================================
    // USER NOT LOGGED IN
    // ==========================================

    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // ==========================================
    // NOT ORGANIZER
    // ==========================================

    if (
        user.role !==
        "organizer"
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    // ==========================================
    // CHECK MEMBERSHIP
    // ==========================================

    const isMembershipActive =

        user.membershipStatus ===
            "active" &&

        user.membershipExpiry &&

        new Date(
            user.membershipExpiry
        ) > new Date();


    // ==========================================
    // NO ACTIVE MEMBERSHIP
    // ==========================================

    if (!isMembershipActive) {

        return (
            <Navigate
                to="/membership"
                replace
            />
        );

    }


    // ==========================================
    // MEMBERSHIP ACTIVE
    // ==========================================

    return children;

};


export default MembershipRoute;