import React from "react";
import { Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const GuestRoute = ({ children }) => {

    const { user } = useAuthContext();

    // If already logged in,
    // do not allow Login or Signup page
    if (user) {
        return <Navigate to="/" replace />;
    }

    // Not logged in
    // Allow Login / Signup
    return children;
};

export default GuestRoute;