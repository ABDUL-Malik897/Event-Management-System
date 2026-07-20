import React from "react";
import useAuthContext from "../hooks/useAuthContext";

import GuestHome from "../Pages/GuestHome";
import Home from "../Pages/Home";
import OrganizerHome from "../Pages/OrganizerHome";
import AdminHome from "../Pages/AdminHome";

const HomeRoute = () => {

    const { user } = useAuthContext();

    // Guest
    if (!user) {
        return <GuestHome />;
    }

    const role = user.role;

    // Admin
    if (role === "admin") {
        return <AdminHome />;
    }

    // Organizer
    if (role === "organizer") {
        return <OrganizerHome />;
    }

    // Normal User
    if (role === "user") {
        return <Home />;
    }

    // Fallback
    return <GuestHome />;
};

export default HomeRoute;